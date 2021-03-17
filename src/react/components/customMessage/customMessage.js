import React, {
	useState,
	Fragment,
	useMemo,
	useEffect
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography, Switch, Button
} from '@material-ui/core';
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

// transformers
import fromPulse from '../../transformers/fromPulse';

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
		alignSelf: 'center'
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

function CustomMessage() {
	const classes = useStyles();
	const [sendToAppointmentList, setSendToAppointmentList] = useState(false);
	const [appointments, setAppointments] = useState(null);
	const [filePath, setFilePath] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [message, setMessage] = useState('');
	const [showReportTable, setShowReportTable] = useState(false);
	const phoneNumberIsValid = useMemo(() => validatePhoneNumber(phoneNumber), [phoneNumber]);
	const messageIsValid = useMemo(() => (sendToAppointmentList || !message.match(/{{.+}}/g)), [sendToAppointmentList, message]);
	const [messageTemplates, setMessageTemplates] = useState(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState('');
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const enableSendButtons = useMemo(() => (
		(sendToAppointmentList ? appointments : phoneNumberIsValid && messageIsValid) && message
	), [sendToAppointmentList, appointments, phoneNumberIsValid, messageIsValid, message]);

	useEffect(() => {
		persistentStorage.getMessageTemplates().then(templates => {
			setMessageTemplates(templates);
		});
	}, []);

	const handleSwitch = event => {
		setSendToAppointmentList(event.target.checked);
	};

	const handleMessageChange = newMessage => {
		setMessage(newMessage);
	};

	const handleMessageAppend = value => {
		setMessage(prevMessage => `${prevMessage}${value}`);
	};

	const handleBrowseClick = () => {
		const csvPromise = csvImporter.getCSV();
		csvPromise.then(({ result }) => transformersByEhr[selectedEhr](result.data)).then(setAppointments);
		csvPromise.then(({ path }) => setFilePath(path));
	};

	const handleFilePathChange = path => {
		setFilePath(path);
		// handle reload of appointments here
	};

	const onSendAsSms = () => {
		twilio.sendSMS(phoneNumber, message).then(sentSuccessfully => {
			setSnackbarSeverity(sentSuccessfully ? 'success' : 'error');
			setSnackbarMessage(sentSuccessfully ? 'SMS message sent successfully' : 'Error sending the SMS message');
			setShowSnackbar(true);
		});
	};

	const onSendAsCall = () => {
		twilio.sendCall(phoneNumber, message).then(sentSuccessfully => {
			setSnackbarSeverity(sentSuccessfully ? 'success' : 'error');
			setSnackbarMessage(sentSuccessfully ? 'Phone call sent successfully' : 'Error sending the phone call');
			setShowSnackbar(true);
		});
	};

	return (
		<div className={classes.root}>
			{showReportTable && (
				<Fragment>
					<Button
						onClick={() => setShowReportTable(false)}
						className={classes.backButton}
						color="primary"
						startIcon={<ArrowBackIos />}>
						Back
					</Button>
					<ReportTable reminders={appointments} />
				</Fragment>
			)}
			{!showReportTable && (
				<Fragment>
					<div className={classes.sendTo}>
						<Typography variant="h5" display="inline">Send To Specific Number</Typography>
						<Switch
							checked={sendToAppointmentList}
							onChange={handleSwitch}
							color="default"
							data-testid="sendByToggle-id"
						/>
						<Typography variant="h5" display="inline">Send To Appointment List</Typography>
					</div>
					<div>
						{sendToAppointmentList && <BrowseFile onBrowseClick={handleBrowseClick} filePath={filePath} onFilePathChange={handleFilePathChange} label="Import CSV" />}
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
				open={showSnackbar}
				onClose={() => { setShowSnackbar(false); }}
				autoHideDuration={5000}
			/>
		</div>
	);
}

export default CustomMessage;
