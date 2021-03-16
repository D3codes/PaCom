import React, { useEffect, useState, Fragment } from 'react';
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

// transformers
import fromPulse from '../../transformers/fromPulse';

const AllowSendOutsideRange = {
	NoValidation: 0,
	ShowWarning: 1,
	Block: 2
};

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
		const title = 'Unmapped Provider(s)';
		const message = 'There are unmapped providers in the document that was just uploaded. '
			+ 'Please visit the Provider Mappings tab and create a mapping for any unmapped providers. '
			+ 'Reminders will not be sent out if there are any unmapped providers.';
		return messageController.showInfo(title, message);
	}
	return null;
}

async function validateAppointmentDates(reminders, dateVerificationSettings) {
	if (dateVerificationSettings.allowSendOutsideRange === AllowSendOutsideRange.NoValidation) return true;
	const isValid = reminders.some(reminder => valiDate(reminder.getIn(['appointment', 'date']), dateVerificationSettings));
	if (!isValid) {
		const message = dateVerificationSettings.allowSendOutsideRange === AllowSendOutsideRange.ShowWarning
			? 'Before proceeding, ensure you want to send reminders with appointment dates that are outside the specified date range.'
			: 'Reminders CANNOT be sent due to appointment dates that are outside the specified date range.';
		messageController.showInfo('There are dates outside the allowed range', message);
	}
	return isValid;
}

function addUnknownProviders(reminders) {
	const unknownProviders = new Set(reminders.map(reminder => reminder.getIn(['appointment', 'provider'])).filter(provider => !provider.get('target')));
	unknownProviders?.forEach(persistentStorage.addProviderMapping);
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
	const [isValid, setIsValid] = useState(null);

	useEffect(() => {
		persistentStorage.getProviderMappings()
			.then(setProviderMappings)
			.then(() => persistentStorage.getSettings())
			.then(settings => setDateVerificationSettings(settings.appointmentReminders.dateVerification));
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
		csvPromise.then(({ result }) => transformersByEhr[selectedEhr](result.data, providerMappings)).then(setReminders);
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
			csvPromise.then(({ result }) => transformersByEhr[selectedEhr](result.data)).then(setReminders);
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

	const sendDisabled = dateVerificationSettings?.allowSendOutsideRange === AllowSendOutsideRange.Block && !isValid;

	return (
		<div className={classes.appointmentRemindersContainer}>
			<BrowseFile onBrowseClick={handleBrowseClick} filePath={filePath} onFilePathChange={handleFilePathChange} label="Import CSV" />
			{reminders
				? <ReportTable reminders={reminders} sendDisabled={sendDisabled} />
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
				message="Invalid File Type - Expected CSV"
				onClose={() => { setShowAlertSnackbar(false); }}
			/>
		</div>
	);
}

export default AppointmentReminders;
