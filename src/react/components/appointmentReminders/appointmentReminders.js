import React, { useEffect, useState, Fragment } from 'react';
import {
	makeStyles, Typography, CircularProgress, Button, Slide
} from '@material-ui/core';
import { SystemUpdateAlt } from '@material-ui/icons';
import { FileDrop } from 'react-file-drop';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import useAsyncError from '../../errors/asyncError';

import ReportTable from '../reportTable/reportTable';
import csvImporter from '../../utilities/csvImporter';
import AlertSnackbar from '../alertSnackbar';
import persistentStorage from '../../utilities/persistentStorage';
import dialogController from '../../utilities/dialogController';
import valiDate from '../../validators/dateValidator';
import providerMappingValidator from '../../validators/validateProviderMappings';
import listSender from '../../utilities/listSender';
// import { DRAWER_WIDTH } from '../drawer/miniDrawer';

// transformers
import fromPulse from '../../transformers/fromPulse';
import AllowSendOutsideRange from '../../models/allowSendOutsideRange';

import { DefaultReminderTemplatesNotDefinedTitle, DefaultReminderTemplatesNotDefinedMessage } from '../../localization/en/dialogText';
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
		height: '100%',
		position: 'relative'
	},
	fileDrop: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: 4,
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
		color: theme.palette.text.secondary,
		marginTop: theme.spacing(2)
	},
	dragAndDropIconOver: {
		color: theme.palette.primary.main
	},
	fileDropContent: {
		display: 'flex',
		flexFlow: 'column'
	},
	reportTableContainer: {
		zIndex: 1,
		display: 'flex',
		flexFlow: 'column',
		height: '100%',
		backgroundColor: '#fafafa'
	},
	fileDropContainer: {
		zIndex: 0,
		display: 'flex',
		flexFlow: 'column',
		position: 'absolute',
		height: '100%',
		width: '100%'
	}
}));

function AppointmentReminders({ disableNavigation, onDisableNavigationChange }) {
	const classes = useStyles();
	const [reminders, setReminders] = useState(null);
	const [filePath, setFilePath] = useState('');
	const [draggingOver, setDraggingOver] = useState(false);
	const [fileDropped, setFileDropped] = useState(false);

	const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
	const [snackbarTitle, setSnackbarTitle] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState(AlertSnackbar.Severities.Info);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const [providerMappings, setProviderMappings] = useState(null);
	const [dateVerificationSettings, setDateVerificationSettings] = useState(null);
	const [defaultTemplatesDefined, setDefaultTemplatesDefined] = useState(false);
	const [hasWritePermission, setHasWritePermission] = useState(false);

	const [validationRan, setValidationRan] = useState(false);
	const [isValid, setIsValid] = useState(null);
	const [sendClicked, setSendClicked] = useState(false);

	const throwError = useAsyncError();

	useEffect(() => {
		persistentStorage.getProviderMappings()
			.then(setProviderMappings)
			.then(() => persistentStorage.getSettings())
			.then(settings => {
				setDateVerificationSettings(settings.appointmentReminders.dateVerification);
				const defaultPhone = settings.appointmentReminders.defaultReminderTemplates.phone;
				const defaultSms = settings.appointmentReminders.defaultReminderTemplates.sms;
				if (!(defaultPhone && defaultSms)) {
					setDefaultTemplatesDefined(false);
				} else {
					persistentStorage.getMessageTemplates().then(templates => {
						const defaultSmsReminder = templates.find(template => template.name === defaultSms);
						const defaultPhoneReminder = templates.find(template => template.name === defaultPhone);
						setDefaultTemplatesDefined(Boolean(defaultSmsReminder && defaultPhoneReminder));
					});
				}
			})
			.then(() => persistentStorage.getSettings(true))
			.then(settings => { setHasWritePermission(settings.shareData.behavior !== 1); });
	}, []);

	useEffect(() => {
		if (reminders && !validationRan && dateVerificationSettings) {
			if (hasWritePermission) providerMappingValidator.addUnknownProviders(reminders);
			providerMappingValidator.validateProviderMappings(reminders)
				.then(() => valiDate.validateAppointmentDates(reminders, dateVerificationSettings))
				.then(valid => {
					setIsValid(valid);
					setValidationRan(true);
				});
		}
	}, [reminders]);

	const handleAppointmentListImport = (appointmentListPath = null) => {
		const csvPromise = csvImporter.getCSV(appointmentListPath);
		csvPromise.then(({ result }) => transformersByEhr[selectedEhr](result.data, providerMappings)).then(remindersList => {
			setValidationRan(false);
			setSendClicked(false);
			setReminders(remindersList);
			if (!defaultTemplatesDefined) dialogController.showWarning(DefaultReminderTemplatesNotDefinedTitle, DefaultReminderTemplatesNotDefinedMessage);
		}).catch(e => throwError(e));
		csvPromise.then(({ path }) => setFilePath(path));
	};

	const handleFileDrop = files => {
		setDraggingOver(false);
		if (!files) return;
		setFileDropped(true);
		const droppedFilePath = files[0].path;
		try {
			handleAppointmentListImport(droppedFilePath);
		} catch (InvalidFileTypeException) {
			setSnackbarSeverity(AlertSnackbar.Severities.Warning);
			setSnackbarTitle('');
			setSnackbarMessage(InvalidFileTypeMessage);
			setShowAlertSnackbar(true);
		}
		setFileDropped(false);
	};

	const onSendingComplete = () => {
		onDisableNavigationChange(false);

		const allSentSuccessfully = reminders.filter(reminder => reminder.status === 'Failed').length === 0;
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
			<Slide direction="left" in={!!reminders} mountOnEnter unmountOnExit>
				<div className={classes.reportTableContainer}>
					<ReportTable
						onSend={handleSend}
						reminders={reminders}
						sendDisabled={sendDisabled}
						onBack={() => setReminders(null)}
						filePath={filePath}
						disableNavigation={disableNavigation}
					/>
				</div>
			</Slide>
			<div className={classes.fileDropContainer}>
				<FileDrop
					onDrop={handleFileDrop}
					onDragOver={() => { setDraggingOver(true); }}
					onDragLeave={() => { setDraggingOver(false); }}
					className={clsx(classes.fileDrop, { [classes.fileDropOver]: draggingOver })}>
					<div className={classes.fileDropContent}>
						{fileDropped
							? <CircularProgress />
							: (
								<Fragment>
									<Button variant="contained" color="primary" onClick={() => { handleAppointmentListImport(); }}>Browse for Appointment List</Button>
									<SystemUpdateAlt className={clsx(classes.dragAndDropIcon, { [classes.dragAndDropIconOver]: draggingOver })} />
									<Typography
										align="center"
										color={draggingOver ? 'primary' : 'textSecondary'}
										variant="subtitle1">
									or drag and drop here
									</Typography>
								</Fragment>
							)}
					</div>
				</FileDrop>
			</div>
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
