import React, {
	useState,
	Fragment,
	useMemo,
	useEffect
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, ButtonGroup } from '@material-ui/core';
import {
	Phone, Sms, ArrowForwardIos, ArrowBackIos
} from '@material-ui/icons';
import clsx from 'clsx';
import BrowseFile from '../browseFile';
import csvImporter from '../../utilities/csvImporter';
import validatePhoneNumber from '../../validators/validatePhoneNumber';
import IconTextField from '../iconTextField';
import ContainedLabeledList from '../containedLabeledList';
import ReportTable from '../reportTable/reportTable';
import persistentStorage from '../../utilities/persistentStorage';
import twilio from '../../utilities/twilioClient';
import AlertSnackBar from '../alertSnackbar';
import MessageCompose from './messageCompose';
import valiDate from '../../validators/dateValidator';
import providerMappingValidator from '../../validators/validateProviderMappings';
import useAsyncError from '../../errors/asyncError';

// transformers
import fromPulse from '../../transformers/fromPulse';
import AllowSendOutsideRange from '../../models/allowSendOutsideRange';
import {
	SmsSentSuccessfully, ErrorSendingSms,
	CallSentSuccessfully, ErrorSendingCall,
	AllRemindersSentSuccessfully,
	ErrorSendingSomeRemindersTitle, ErrorSendingSomeRemindersMessage
} from '../../localization/en/snackbarText';
import listSender from '../../utilities/listSender';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	actionButtonContainer: {
		display: 'flex',
		alignSelf: 'flex-end'
	},
	sendTo: {
		alignSelf: 'center',
		marginBottom: theme.spacing()
	},
	phoneNumberPadding: {
		paddingBottom: 22
	},
	adornmentDivider: {
		margin: theme.spacing()
	},
	composeContainer: {
		flex: 1,
		height: '200px',
		display: 'flex'
	},
	listContainer: {
		width: `calc(33% - ${theme.spacing()}px)`,
		height: '90%'
	},
	messageComposeContainer: {
		height: '100%',
		width: '67%',
		marginLeft: theme.spacing()
	},
	farRightActionButton: {
		marginLeft: theme.spacing()
	},
	backButton: {
		width: '10%'
	}
}));

const Ehrs = {
	Pulse: 'Pulse'
};

const transformersByEhr = {
	[Ehrs.Pulse]: fromPulse
};

const selectedEhr = Ehrs.Pulse;

function CustomMessage({ disableNavigation, onDisableNavigationChange }) {
	const classes = useStyles();
	const [sendToAppointmentList, setSendToAppointmentList] = useState(false);
	const [reminders, setReminders] = useState(null);
	const [filePath, setFilePath] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [message, setMessage] = useState('');
	const phoneNumberIsValid = useMemo(() => validatePhoneNumber(phoneNumber), [phoneNumber]);
	const messageIsValid = useMemo(() => (sendToAppointmentList || !message.match(/{{.+}}/g)), [sendToAppointmentList, message]);

	const [providerMappings, setProviderMappings] = useState(null);
	const [messageTemplates, setMessageTemplates] = useState(null);
	const [dateVerificationSettings, setDateVerificationSettings] = useState(null);
	const [hasWritePermission, setHasWritePermission] = useState(false);

	const [snackbarSeverity, setSnackbarSeverity] = useState(AlertSnackBar.Severities.Info);
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [snackbarTitle, setSnackbarTitle] = useState('');
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const [validationRan, setValidationRan] = useState(false);
	const [isValid, setIsValid] = useState(null);
	const [sendClicked, setSendClicked] = useState(false);

	const [showReportTable, setShowReportTable] = useState(false);
	const enableSendButtons = useMemo(() => (
		(sendToAppointmentList ? reminders : phoneNumberIsValid && messageIsValid) && message
	), [sendToAppointmentList, reminders, phoneNumberIsValid, messageIsValid, message]);

	const throwError = useAsyncError();

	useEffect(() => {
		persistentStorage.getMessageTemplates()
			.then(templates => { setMessageTemplates(templates); })
			.then(() => persistentStorage.getSettings())
			.then(settings => { setDateVerificationSettings(settings.customMessages.dateVerification); })
			.then(() => persistentStorage.getSettings(true))
			.then(settings => { setHasWritePermission(settings.shareData.behavior !== 1); })
			.then(() => persistentStorage.getProviderMappings())
			.then(setProviderMappings);
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

	const handleMessageChange = newMessage => {
		setMessage(newMessage);
	};

	const handleMessageAppend = value => {
		setMessage(prevMessage => `${prevMessage}${value}`);
	};

	const handleBrowseClick = () => {
		const csvPromise = csvImporter.getCSV().catch(e => throwError(e));
		csvPromise.then(({ result }) => transformersByEhr[selectedEhr](result.data, providerMappings)).then(remindersList => {
			setValidationRan(false);
			setSendClicked(false);
			setReminders(remindersList);
		}).catch(e => throwError(e));
		csvPromise.then(({ path }) => setFilePath(path));
	};

	const onSendAsSms = () => {
		twilio.sendSMS(phoneNumber, message).then(sentSuccessfully => {
			setSnackbarSeverity(sentSuccessfully ? AlertSnackBar.Severities.Success : AlertSnackBar.Severities.Error);
			setSnackbarTitle('');
			setSnackbarMessage(sentSuccessfully ? SmsSentSuccessfully : ErrorSendingSms);
			setShowSnackbar(true);
		}).catch(e => throwError(e));
	};

	const onSendAsCall = () => {
		twilio.sendCall(phoneNumber, message).then(sentSuccessfully => {
			setSnackbarSeverity(sentSuccessfully ? AlertSnackBar.Severities.Success : AlertSnackBar.Severities.Error);
			setSnackbarTitle('');
			setSnackbarMessage(sentSuccessfully ? CallSentSuccessfully : ErrorSendingCall);
			setShowSnackbar(true);
		}).catch(e => throwError(e));
	};

	const onSendingComplete = () => {
		onDisableNavigationChange(false);

		const allSentSuccessfully = reminders.filter(reminder => reminder.status === 'Failed').length === 0;
		setSnackbarSeverity(allSentSuccessfully ? AlertSnackBar.Severities.Success : AlertSnackBar.Severities.Error);
		setSnackbarTitle(allSentSuccessfully ? '' : ErrorSendingSomeRemindersTitle);
		setSnackbarMessage(allSentSuccessfully ? AllRemindersSentSuccessfully : ErrorSendingSomeRemindersMessage);
		setShowSnackbar(true);
	};

	const handleSend = () => {
		setSendClicked(true);
		onDisableNavigationChange(true);
		listSender.sendCustomMessage(reminders, message, setReminders, onSendingComplete);
	};

	const sendDisabled = (dateVerificationSettings?.allowSendOutsideRange === AllowSendOutsideRange.Block && !isValid) || sendClicked;

	return (
		<div className={classes.root}>
			{showReportTable && (
				<Fragment>
					<Button
						onClick={() => setShowReportTable(false)}
						className={classes.backButton}
						color="primary"
						startIcon={<ArrowBackIos />}
						disabled={disableNavigation}>
						Back
					</Button>
					<ReportTable reminders={reminders} onSend={handleSend} sendDisabled={sendDisabled} />
				</Fragment>
			)}
			{!showReportTable && (
				<Fragment>
					<div className={classes.sendTo}>
						<ButtonGroup disableElevation color="primary">
							<Button variant={sendToAppointmentList ? 'outlined' : 'contained'} onClick={() => { setSendToAppointmentList(false); }}>Send to Specific Number</Button>
							<Button variant={sendToAppointmentList ? 'contained' : 'outlined'} onClick={() => { setSendToAppointmentList(true); }}>Send to Appointment List</Button>
						</ButtonGroup>
					</div>
					<div>
						{sendToAppointmentList && (
							<BrowseFile onBrowseClick={handleBrowseClick} filePath={filePath} onFilePathChange={setFilePath} label="Appointment List" />
						)}
						{!sendToAppointmentList && (
							<div className={clsx({ [classes.phoneNumberPadding]: phoneNumberIsValid })}>
								<IconTextField
									testId="phoneNumber-field"
									onChange={setPhoneNumber}
									label="Phone Number"
									focused
									helperText={phoneNumberIsValid ? '' : 'Invalid Phone Number'}
									error={!phoneNumberIsValid}
									value={phoneNumber}
									Icon={Phone}
									startAdornment="+1"
								/>
							</div>
						)}
					</div>
					<div className={classes.composeContainer}>
						<div className={classes.listContainer}>
							<ContainedLabeledList onClick={template => setMessage(template.body)} label="Templates" items={messageTemplates} />
						</div>
						<div className={classes.messageComposeContainer}>
							<MessageCompose
								messageIsValid={messageIsValid}
								message={message}
								onMessageChange={handleMessageChange}
								onAppend={handleMessageAppend}
								disableDynamicValues={!sendToAppointmentList}
								helperText={messageIsValid ? '' : 'Messages sent to a specific number cannot contain dynamic values.'}
							/>
						</div>
					</div>
					<div className={classes.actionButtonContainer}>
						{!sendToAppointmentList && (
							<Fragment>
								<Button
									disabled={!enableSendButtons}
									color="primary"
									endIcon={<Sms />}
									variant={enableSendButtons ? 'contained' : 'outlined'}
									onClick={onSendAsSms}>
									Send as SMS
								</Button>
								<Button
									disabled={!enableSendButtons}
									color="primary"
									endIcon={<Phone />}
									variant={enableSendButtons ? 'contained' : 'outlined'}
									onClick={onSendAsCall}
									className={classes.farRightActionButton}>
									Send as Call
								</Button>
							</Fragment>
						)}
						{sendToAppointmentList && (
							<Button
								disabled={!enableSendButtons}
								color="primary"
								endIcon={<ArrowForwardIos />}
								variant={enableSendButtons ? 'contained' : 'outlined'}
								onClick={() => setShowReportTable(true)}>
								Continue
							</Button>
						)}
					</div>
				</Fragment>
			)}
			<AlertSnackBar
				severity={snackbarSeverity}
				message={snackbarMessage}
				title={snackbarTitle}
				open={showSnackbar}
				onClose={() => { setShowSnackbar(false); }}
				autoHideDuration={5000}
			/>
		</div>
	);
}

CustomMessage.propTypes = {
	disableNavigation: PropTypes.bool.isRequired,
	onDisableNavigationChange: PropTypes.func.isRequired
};

export default CustomMessage;
