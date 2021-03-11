import React, {
	useState,
	Fragment,
	useMemo,
	useEffect
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography, Switch, Button, TextField
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
		width: 'calc(33% - 10px)',
		height: '90%'
	},
	textField: {
		width: '33%',
		height: '100%',
		marginRight: '10px',
		marginLeft: '10px',
		marginTop: '32px'
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
	const enableButtoms = sendToAppointmentList ? !!appointments : phoneNumberIsValid;
	const [messageTemplates, setMessageTemplates] = useState(null);
	const [dynamicValues, setDynamicValues] = useState(null);

	const reloadTemplatesAndValues = () => {
		persistentStorage.getDynamicValues().then(values => {
			setDynamicValues(values);
		});
		persistentStorage.getMessageTemplates().then(templates => {
			setMessageTemplates(templates);
		});
	};

	useEffect(() => {
		reloadTemplatesAndValues();
	}, []);

	const handleSwitch = event => {
		setSendToAppointmentList(event.target.checked);
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
		// send as sms
	};

	const onSendAsCall = () => {
		// send as call
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
						<Typography color="primary" variant="h5" display="inline">Send To Specific Number</Typography>
						<Switch
							checked={sendToAppointmentList}
							onChange={handleSwitch}
							color="default"
							data-testid="sendByToggle-id"
						/>
						<Typography color="primary" variant="h5" display="inline">Send To Appointment List</Typography>
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
							<ContainedLabeledList onClick={template => setMessage(template.value)} label="Templates" items={messageTemplates} />
						</div>
						<TextField
							label="Message"
							multiline
							rows={15}
							variant="outlined"
							className={classes.textField}
							value={message}
							onChange={event => { setMessage(event.target.value); }}
						/>
						<div className={classes.listContainer}>
							<ContainedLabeledList onClick={value => setMessage(prevMessage => `${prevMessage}{{${value.name}}}`)} label="Dynamic Values" items={dynamicValues} />
						</div>
					</div>
					<div className={classes.actionButtonContainer}>
						{!sendToAppointmentList && (
							<Fragment>
								<Button
									disabled={!enableButtoms}
									color="primary"
									endIcon={<Sms />}
									variant={enableButtoms ? 'contained' : 'outlined'}
									onClick={onSendAsSms}>
									Send as SMS
								</Button>
								<Button
									disabled={!enableButtoms}
									color="primary"
									endIcon={<Phone />}
									variant={enableButtoms ? 'contained' : 'outlined'}
									onClick={onSendAsCall}
									className={classes.farRightActionButton}>
									Send as Call
								</Button>
							</Fragment>
						)}
						{sendToAppointmentList && (
							<Button
								disabled={!enableButtoms}
								color="primary"
								endIcon={<ArrowForwardIos />}
								variant={enableButtoms ? 'contained' : 'outlined'}
								onClick={() => setShowReportTable(true)}>
								Continue
							</Button>
						)}
					</div>
				</Fragment>
			)}
		</div>
	);
}

export default CustomMessage;
