import React, {
	useEffect, useState, Fragment, useReducer
} from 'react';
import {
	makeStyles, Typography, CircularProgress, Button
} from '@material-ui/core';
import { SystemUpdateAlt } from '@material-ui/icons';
import { FileDrop } from 'react-file-drop';
import clsx from 'clsx';

import BrowseFile from '../browseFile';
import ReportTable from '../reportTable/reportTable';
import csvImporter from '../../utilities/csvImporter';
import AlertSnackbar from '../alertSnackbar';
import persistentStorage from '../../utilities/persistentStorage';
import messageController from '../../utilities/messageController';
import valiDate from '../../utilities/dateValidator';
import listSender from '../../utilities/listSender';

// transformers
import fromPulse from '../../transformers/fromPulse';
import Provider from '../../models/provider';
import AllowSendOutsideRange from '../../models/allowSendOutsideRange';

import {
	UnmappedProvidersWarningTitle, UnmappedProvidersWarningMessage,
	DateVerificationWarningTitle, DateVerificationWarningMessage,
	DateVerificationBlockTitle, DateVerificationBlockMessage,
	DefaultReminderTemplatesNotDefinedTitle, DefaultReminderTemplatesNotDefinedMessage
} from '../../localization/en/dialogText';
import { InvalidFileTypeMessage } from '../../localization/en/snackbarText';

const Ehrs = {
	Pulse: 'Pulse'
};

const transformersByEhr = {
	Pulse: fromPulse
};

const selectedEhr = Ehrs.Pulse;

const useStyles = makeStyles(theme => ({
	appointmentRemindersContainer: {
		display: 'flex',
		flexFlow: 'column',
		height: '100%'
	},
	fileDrop: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: 4,
		margin: theme.spacing(2, 0),
		transition: '200ms'
	},
	fileDropOver: {
		border: `2px solid ${theme.palette.primary.main}`,
		boxShadow: `0 0 6px ${theme.palette.primary.main}`,
		transition: '200ms'
	},
	dragAndDropIcon: {
		alignSelf: 'center',
		fontSize: '5rem',
		color: theme.palette.text.secondary
	},
	dragAndDropIconOver: {
		color: theme.palette.primary.main
	},
	fileDropContent: {
		display: 'flex',
		flexFlow: 'column'
	}
}));

async function validateProviderMappings(reminders) {
	if (reminders.some(reminder => !reminder.getIn(['appointment', 'provider', 'target']))) {
		return messageController.showWarning(UnmappedProvidersWarningTitle, UnmappedProvidersWarningMessage);
	}
	return null;
}

async function validateAppointmentDates(reminders, dateVerificationSettings) {
	if (dateVerificationSettings.allowSendOutsideRange === AllowSendOutsideRange.NoValidation) return true;

	const isValid = reminders.some(reminder => valiDate(reminder.getIn(['appointment', 'date']), dateVerificationSettings));
	if (!isValid && dateVerificationSettings.allowSendOutsideRange === AllowSendOutsideRange.ShowWarning) {
		messageController.showWarning(DateVerificationWarningTitle, DateVerificationWarningMessage);
	} else if (!isValid && dateVerificationSettings.allowSendOutsideRange === AllowSendOutsideRange.Block) {
		messageController.showError(DateVerificationBlockTitle, DateVerificationBlockMessage);
	}

	return isValid;
}

function addUnknownProviders(reminders) {
	const unknownProviderSources = reminders
		.map(reminder => reminder.getIn(['appointment', 'provider']))
		.filter(provider => !provider.get('target'))
		.map(({ source }) => source);
	const distinctSources = new Set(unknownProviderSources);
	distinctSources.forEach(source => persistentStorage.addProviderMapping(new Provider(source)));
}

function AppointmentReminders() {
	const classes = useStyles();
	const [reminders, setReminders] = useState(null);
	const [filePath, setFilePath] = useState('');
	const [draggingOver, setDraggingOver] = useState(false);
	const [fileDropped, setFileDropped] = useState(false);
	const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
	const [providerMappings, setProviderMappings] = useState(null);
	const [dateVerificationSettings, setDateVerificationSettings] = useState(null);
	const [defaultTemplatesDefined, setDefaultTemplatesDefined] = useState(false);
	const [isValid, setIsValid] = useState(null);
	const [sendClicked, setSendClicked] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

	useEffect(() => {
		persistentStorage.getProviderMappings()
			.then(setProviderMappings)
			.then(() => persistentStorage.getSettings())
			.then(settings => {
				setDateVerificationSettings(settings.appointmentReminders.dateVerification);
				setDefaultTemplatesDefined(Boolean(settings.appointmentReminders.defaultReminderTemplates.phone && !!settings.appointmentReminders.defaultReminderTemplates.sms));
			});
	}, []);

	useEffect(() => {
		if (reminders && dateVerificationSettings) {
			addUnknownProviders(reminders);
			validateProviderMappings(reminders)
				.then(() => validateAppointmentDates(reminders, dateVerificationSettings))
				.then(setIsValid);
		}
	}, [reminders]);

	const handleBrowseClick = () => {
		const csvPromise = csvImporter.getCSV();
		csvPromise.then(({ result }) => transformersByEhr[selectedEhr](result.data, providerMappings)).then(remindersList => {
			setReminders(remindersList);
			setSendClicked(false);
			if (!defaultTemplatesDefined) messageController.showWarning(DefaultReminderTemplatesNotDefinedTitle, DefaultReminderTemplatesNotDefinedMessage);
		});
		csvPromise.then(({ path }) => setFilePath(path));
	};

	const handleDragOver = () => {
		setDraggingOver(true);
	};

	const handleDragLeave = () => {
		setDraggingOver(false);
	};

	const handleFileDrop = files => {
		handleDragLeave();
		if (!files) return;
		setFileDropped(true);
		const droppedFilePath = files[0].path;
		try {
			const csvPromise = csvImporter.getCSV(droppedFilePath);
			csvPromise.then(({ result }) => transformersByEhr[selectedEhr](result.data, providerMappings)).then(remindersList => {
				setReminders(remindersList);
				setSendClicked(false);
				if (!defaultTemplatesDefined) messageController.showWarning(DefaultReminderTemplatesNotDefinedTitle, DefaultReminderTemplatesNotDefinedMessage);
			});
			csvPromise.then(({ path }) => setFilePath(path));
		} catch (InvalidFileTypeException) {
			setFileDropped(false);
			setShowAlertSnackbar(true);
		}
	};

	const handleFilePathChange = path => {
		setFilePath(path);
		// handle reload of appointments here
	};

	const handleRemindersUpdate = r => {
		setReminders(r);
		forceUpdate();
	};

	const handleSend = () => {
		setSendClicked(true);
		listSender.sendAppointmentReminders(reminders, handleRemindersUpdate);
	};

	const sendDisabled = (dateVerificationSettings?.allowSendOutsideRange === AllowSendOutsideRange.Block && !isValid) || sendClicked || !defaultTemplatesDefined;

	return (
		<div className={classes.appointmentRemindersContainer}>
			<BrowseFile onBrowseClick={handleBrowseClick} filePath={filePath} onFilePathChange={handleFilePathChange} label="Appointment List" />
			{reminders
				? <ReportTable onSend={handleSend} reminders={reminders} sendDisabled={sendDisabled} />
				: (
					<FileDrop
						onDrop={handleFileDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						className={clsx(classes.fileDrop, { [classes.fileDropOver]: draggingOver })}>
						<div className={classes.fileDropContent}>
							{fileDropped
								? <CircularProgress />
								: (
									<Fragment>
										<SystemUpdateAlt className={clsx(classes.dragAndDropIcon, { [classes.dragAndDropIconOver]: draggingOver })} />
										<Typography
											align="center"
											className={classes.noRemindersText}
											color={draggingOver ? 'primary' : 'textSecondary'}
											variant="subtitle1">
											<Button color="primary" onClick={handleBrowseClick}>Browse for a file</Button> or drag it here
										</Typography>
									</Fragment>
								)}
						</div>
					</FileDrop>
				)}
			<AlertSnackbar
				open={showAlertSnackbar}
				severity={AlertSnackbar.Severities.Warning}
				message={InvalidFileTypeMessage}
				onClose={() => { setShowAlertSnackbar(false); }}
			/>
		</div>
	);
}

export default AppointmentReminders;
