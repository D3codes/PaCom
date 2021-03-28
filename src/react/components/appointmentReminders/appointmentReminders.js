import React, { useEffect, useState, Fragment } from 'react';
import {
	makeStyles, Typography, CircularProgress, Button
} from '@material-ui/core';
import { SystemUpdateAlt } from '@material-ui/icons';
import { FileDrop } from 'react-file-drop';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import BrowseFile from '../browseFile';
import ReportTable from '../reportTable/reportTable';
import csvImporter from '../../utilities/csvImporter';
import AlertSnackbar from '../alertSnackbar';
import persistentStorage from '../../utilities/persistentStorage';
import messageController from '../../utilities/messageController';
import valiDate from '../../validators/dateValidator';
import listSender from '../../utilities/listSender';

// transformers
import fromPulse from '../../transformers/fromPulse';
import Provider from '../../models/provider';
import AllowSendOutsideRange from '../../models/allowSendOutsideRange';

import {
	ErrorInAppointmentListTitle, ErrorInAppointmentListMessage,
	UnmappedProvidersWarningTitle, UnmappedProvidersWarningMessage,
	DefaultReminderTemplatesNotDefinedTitle, DefaultReminderTemplatesNotDefinedMessage
} from '../../localization/en/dialogText';
import {
	InvalidFileTypeMessage, AllRemindersSentSuccessfully, ErrorSendingSomeRemindersTitle, ErrorSendingSomeRemindersMessage
} from '../../localization/en/snackbarText';

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
	if (reminders.some(reminder => reminder.status === 'Failed')) {
		return messageController.showWarning(ErrorInAppointmentListTitle, ErrorInAppointmentListMessage);
	}
	if (reminders.some(reminder => !reminder.getIn(['appointment', 'provider', 'target']))) {
		return messageController.showWarning(UnmappedProvidersWarningTitle, UnmappedProvidersWarningMessage);
	}
	return null;
}

function addUnknownProviders(reminders) {
	const unknownProviderSources = reminders
		.map(reminder => reminder.getIn(['appointment', 'provider']))
		.filter(provider => !provider.get('target'))
		.map(({ source }) => source);
	const distinctSources = new Set(unknownProviderSources);
	distinctSources.forEach(source => {
		if (source) persistentStorage.addProviderMapping(new Provider(source));
	});
}

function AppointmentReminders({ disableNavigation, onDisableNavigationChange }) {
	const classes = useStyles();
	const [reminders, setReminders] = useState(null);
	const [filePath, setFilePath] = useState('');
	const [draggingOver, setDraggingOver] = useState(false);
	const [fileDropped, setFileDropped] = useState(false);
	const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
	const [snackbarTitle, setSnackbarTitle] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [providerMappings, setProviderMappings] = useState(null);
	const [dateVerificationSettings, setDateVerificationSettings] = useState(null);
	const [defaultTemplatesDefined, setDefaultTemplatesDefined] = useState(false);
	const [validationRan, setValidationRan] = useState(false);
	const [isValid, setIsValid] = useState(null);
	const [sendClicked, setSendClicked] = useState(false);
	const [hasWritePermission, setHasWritePermission] = useState(false);

	useEffect(() => {
		persistentStorage.getProviderMappings()
			.then(setProviderMappings)
			.then(() => persistentStorage.getSettings())
			.then(settings => {
				setDateVerificationSettings(settings.appointmentReminders.dateVerification);
				setDefaultTemplatesDefined(Boolean(settings.appointmentReminders.defaultReminderTemplates.phone && settings.appointmentReminders.defaultReminderTemplates.sms));
			})
			.then(() => persistentStorage.getSettings(true))
			.then(settings => { setHasWritePermission(settings.shareData.behavior !== 1); });
	}, []);

	useEffect(() => {
		if (reminders && !validationRan && dateVerificationSettings) {
			if (hasWritePermission) addUnknownProviders(reminders);
			validateProviderMappings(reminders)
				.then(() => valiDate.validateAppointmentDates(reminders, dateVerificationSettings))
				.then(valid => {
					setIsValid(valid);
					setValidationRan(true);
				});
		}
	}, [reminders]);

	const handleBrowseClick = () => {
		const csvPromise = csvImporter.getCSV();
		csvPromise.then(({ result }) => transformersByEhr[selectedEhr](result.data, providerMappings)).then(remindersList => {
			setReminders(remindersList);
			setValidationRan(false);
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
				setValidationRan(false);
				setSendClicked(false);
				if (!defaultTemplatesDefined) messageController.showWarning(DefaultReminderTemplatesNotDefinedTitle, DefaultReminderTemplatesNotDefinedMessage);
			});
			csvPromise.then(({ path }) => setFilePath(path));
		} catch (InvalidFileTypeException) {
			setFileDropped(false);
			setSnackbarSeverity(AlertSnackbar.Severities.Warning);
			setSnackbarTitle('');
			setSnackbarMessage(InvalidFileTypeMessage);
			setShowAlertSnackbar(true);
		}
	};

	const handleFilePathChange = path => {
		setFilePath(path);
		// handle reload of appointments here
	};

	const onSendingComplete = () => {
		onDisableNavigationChange(false);

		const allSentSuccessfully = (reminders.filter(reminder => reminder.status === 'Failed')).length === 0;
		setSnackbarSeverity(allSentSuccessfully ? AlertSnackbar.Severities.Success : AlertSnackbar.Severities.Error);
		setSnackbarTitle(allSentSuccessfully ? '' : ErrorSendingSomeRemindersTitle);
		setSnackbarMessage(allSentSuccessfully ? AllRemindersSentSuccessfully : ErrorSendingSomeRemindersMessage);
		setShowAlertSnackbar(true);
	};

	const handleSend = () => {
		setSendClicked(true);
		onDisableNavigationChange(true);
		listSender.sendAppointmentReminders(reminders, setReminders, onSendingComplete);
	};

	const sendDisabled = (dateVerificationSettings?.allowSendOutsideRange === AllowSendOutsideRange.Block && !isValid) || sendClicked || !defaultTemplatesDefined;

	return (
		<div className={classes.appointmentRemindersContainer}>
			<BrowseFile disabled={disableNavigation} onBrowseClick={handleBrowseClick} filePath={filePath} onFilePathChange={handleFilePathChange} label="Appointment List" />
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
				severity={snackbarSeverity}
				title={snackbarTitle}
				message={snackbarMessage}
				onClose={() => { setShowAlertSnackbar(false); }}
			/>
		</div>
	);
}

AppointmentReminders.propTypes = {
	disableNavigation: PropTypes.bool.isRequired,
	onDisableNavigationChange: PropTypes.func.isRequired
};

export default AppointmentReminders;
