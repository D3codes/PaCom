import React, {
	useMemo, useEffect, useState, Fragment
} from 'react';
import {
	makeStyles, Typography, CircularProgress, Button, Slide
} from '@material-ui/core';
import { SystemUpdateAlt } from '@material-ui/icons';
import { FileDrop } from 'react-file-drop';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import useAsyncError from '../../errors/asyncError';
import Provider from '../../models/provider';
import Procedure from '../../models/procedure';
import Template from '../../models/template';
import ReportTable from '../reportTable/reportTable';
import csvImporter from '../../utilities/csvImporter';
import AlertSnackbar from '../alertSnackbar';
import dialogController from '../../utilities/dialogController';
import valiDate from '../../validators/dateValidator';
import providerMappingValidator from '../../validators/validateProviderMappings';
import procedureMappingValidator from '../../validators/validateProcedureMappings';
import listSender from '../../utilities/listSender';
import transformer from '../../transformers/transformer';
import AllowSendOutsideRange from '../../models/allowSendOutsideRange';
import SendToModal from '../common/sendToModal';

import { DefaultReminderTemplatesNotDefinedTitle, DefaultReminderTemplatesNotDefinedMessage } from '../../localization/en/dialogText';
import {
	InvalidFileTypeMessage, AllRemindersSentSuccessfully, ErrorSendingSomeRemindersTitle, ErrorSendingSomeRemindersMessage
} from '../../localization/en/snackbarText';

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
		backgroundColor: theme.palette.background.default
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

function AppointmentReminders({
	providerMappings, procedureMappings, appointmentReminderSettings = null, messageTemplates, hasWritePermission = false, disableNavigation, onDisableNavigationChange, reload
}) {
	const classes = useStyles();
	const [reminders, setReminders] = useState(null);
	const [filePath, setFilePath] = useState('');
	const [draggingOver, setDraggingOver] = useState(false);
	const [fileDropped, setFileDropped] = useState(false);

	const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
	const [snackbarTitle, setSnackbarTitle] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState(AlertSnackbar.Severities.Info);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const [showSendToModal, setShowSendToModal] = useState(false);
	const [procedures, setProcedures] = useState(null);
	const [providers, setProviders] = useState(null);

	const dateVerificationSettings = appointmentReminderSettings?.dateVerification;
	const defaultTemplatesDefined = useMemo(() => (
		appointmentReminderSettings?.defaultReminderTemplates?.phone
		&& appointmentReminderSettings?.defaultReminderTemplates?.sms
		&& messageTemplates?.find(template => template.name === appointmentReminderSettings?.defaultReminderTemplates?.phone)
		&& messageTemplates?.find(template => template.name === appointmentReminderSettings?.defaultReminderTemplates?.sms)
	), [appointmentReminderSettings, messageTemplates]);

	const [validationRan, setValidationRan] = useState(false);
	const [isValid, setIsValid] = useState(null);
	const [sendClicked, setSendClicked] = useState(false);

	const throwError = useAsyncError();

	useEffect(() => {
		if (reminders && !validationRan && dateVerificationSettings) {
			if (hasWritePermission) {
				providerMappingValidator.addUnknownProviders(reminders);
				procedureMappingValidator.addUnknownProcedures(reminders);
				reload();
			}
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
		csvPromise.then(({ result }) => transformer.transform(result.data, providerMappings, procedureMappings)).then(remindersList => {
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
		listSender.sendAppointmentReminders(reminders, setReminders, onSendingComplete, procedures || procedureMappings, providers || providerMappings);
	};

	const handleSendToClose = (newProcedures, newProviders) => {
		if (newProcedures) setProcedures(newProcedures);
		if (newProviders) setProviders(newProviders);
		setShowSendToModal(false);
	};

	const handleBack = () => {
		setProcedures(procedureMappings);
		setProviders(providerMappings);
		setReminders(null);
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
						onBack={() => handleBack()}
						filePath={filePath}
						disableNavigation={disableNavigation}
						onSendToClick={() => { setShowSendToModal(true); }}
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
									<Button variant="contained" color="primary" onClick={() => { handleAppointmentListImport(); }}>Browse for Appointments</Button>
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
			{ showSendToModal && (
				<SendToModal
					onClose={(newProcedures, newProviders) => { handleSendToClose(newProcedures, newProviders); }}
					procedures={procedures}
					providers={providers}
					defaultProcedures={procedureMappings}
					defaultProviders={providerMappings}
					forAppointmentReminders
				/>
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
	providerMappings: PropTypes.arrayOf(PropTypes.instanceOf(Provider)).isRequired,
	procedureMappings: PropTypes.arrayOf(PropTypes.instanceOf(Procedure)).isRequired,
	appointmentReminderSettings: PropTypes.shape(
		{
			dateVerification: PropTypes.shape({
				numberOfDays: PropTypes.number,
				endOfRange: PropTypes.number,
				allowSendOutsideRange: PropTypes.number,
				useBusinessDays: PropTypes.bool
			}),
			contactPreferences: PropTypes.shape({
				sendToPreferredAndSms: PropTypes.bool,
				textHomeIfCellNotAvailable: PropTypes.bool
			}),
			defaultReminderTemplates: PropTypes.shape({
				phone: PropTypes.string,
				sms: PropTypes.string
			})
		}
	),
	messageTemplates: PropTypes.arrayOf(PropTypes.instanceOf(Template)).isRequired,
	hasWritePermission: PropTypes.bool,
	disableNavigation: PropTypes.bool.isRequired,
	onDisableNavigationChange: PropTypes.func.isRequired,
	reload: PropTypes.func.isRequired
};

export default AppointmentReminders;
