import React, { useState, Fragment, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography, Switch, List, ListItem, ListItemText, Button, Card, Divider, TextField
} from '@material-ui/core';
import { Phone, Send, Sms } from '@material-ui/icons';
import clsx from 'clsx';
import BrowseFile from '../browseFile';
import csvImporter from '../../utilities/csvImporter';
import validatePhoneNumber from '../../validators/validatePhoneNumber';
import IconTextField from '../iconTextField';

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
	notificationMethodContainer: {
		flex: 1
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
		height: '200px'
	},
	messageTemplatesContainer: {
		float: 'left',
		width: 'calc(33% - 10px)',
		marginRight: '10px',
		height: '100%'
	},
	messageTemplatesListContainer: {
		overflowY: 'hidden',
		height: '90%'
	},
	textField: {
		float: 'left',
		width: '33%',
		height: '100%',
		marginRight: '10px',
		marginTop: '32px'
	},
	variableListContainer: {
		float: 'left',
		width: 'calc(33% - 10px)',
		overflowY: 'hidden',
		height: '90%'
	},
	list: {
		width: '100%',
		overflowY: 'auto',
		height: '100%'
	},
	buttonSpacing: {
		marginLeft: theme.spacing()
	}
}));

const Ehrs = {
	Pulse: 'Pulse'
};

const transformersByEhr = {
	Pulse: fromPulse
};

const selectedEhr = Ehrs.Pulse;

export default function CustomMessage() {
	const classes = useStyles();
	const [sendToAppointmentList, setSendToAppointmentList] = useState(false);
	const [appointments, setAppointments] = useState(null);
	const [filePath, setFilePath] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [message, setMessage] = useState('');
	const phoneNumberIsValid = useMemo(() => validatePhoneNumber(phoneNumber), [phoneNumber]);
	const enableSendButtons = useMemo(() => (sendToAppointmentList ? !!appointments : phoneNumberIsValid), [phoneNumberIsValid, sendToAppointmentList, appointments]);

	// TODO: get templates and variables from persistent storage, once added
	const messageTemplates = [
		{ name: 'template1', value: 'this is template1' },
		{ name: 'template2', value: 'this is template2' },
		{ name: 'template3', value: 'this is template3' },
		{ name: 'template4', value: 'this is template4' },
		{ name: 'template5', value: 'this is template5' }
	];

	const variables = [
		{ name: 'Provider', value: '{{provider}}' },
		{ name: 'Patient', value: '{{patient}}' },
		{ name: 'Appt. Date', value: '{{date}}' },
		{ name: 'Appt. Time', value: '{{time}}' },
		{ name: 'Appt. Duration', value: '{{duration}}' },
		{ name: 'Procedure', value: '{{procedure}}' }
	];

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

	const onTemplateSelect = template => {
		setMessage(template);
	};

	const onVariableSelect = variable => {
		setMessage(prevMessage => prevMessage + variable);
	};

	const onSendToAppointments = () => {
		// show report table and begin sending
	};

	const onSendAsSms = () => {
		// send as sms
	};

	const onSendAsCall = () => {
		// send as call
	};

	return (
		<div className={classes.root}>
			<div className={classes.sendTo}>
				<Typography color="primary" variant="h5" display="inline">Send To Specific Number</Typography>
				<Switch
					checked={sendToAppointmentList}
					onChange={handleSwitch}
					color="default"
				/>
				<Typography color="primary" variant="h5" display="inline">Send To Appointment List</Typography>
			</div>
			<div>
				{sendToAppointmentList && <BrowseFile onBrowseClick={handleBrowseClick} filePath={filePath} onFilePathChange={handleFilePathChange} label="Import CSV" />}
				{!sendToAppointmentList
				&& (
					<div className={clsx({ [classes.phoneNumberPadding]: phoneNumberIsValid })}>
						<IconTextField
							data-testid="phoneNumber-field"
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
				<div className={classes.messageTemplatesContainer}>
					<Typography color="primary" variant="h5" display="inline">Templates</Typography>
					<Card className={classes.messageTemplatesListContainer}>
						<List className={classes.list} dense={false}>
							{messageTemplates.map(template => (
								<React.Fragment>
									<ListItem button onClick={() => onTemplateSelect(template.value)}>
										<ListItemText primary={template.name} />
									</ListItem>
									<Divider />
								</React.Fragment>
							))}
						</List>
					</Card>
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
				<Typography color="primary" variant="h5" display="inline">Variables</Typography>
				<Card className={classes.variableListContainer}>
					<List className={classes.list} dense={false}>
						{variables.map(variable => (
							<React.Fragment>
								<ListItem button onClick={() => onVariableSelect(variable.value)}>
									<ListItemText primary={variable.name} />
								</ListItem>
								<Divider />
							</React.Fragment>
						))}
					</List>
				</Card>
			</div>
			<div className={classes.actionButtonContainer}>
				{!sendToAppointmentList
				&& (
					<Fragment>
						<Button
							disabled={!enableSendButtons}
							color="primary"
							endIcon={<Sms />}
							variant={enableSendButtons ? 'contained' : 'outlined'}
							onClick={onSendAsSms}>
							Send as SMS
						</Button>
						<div className={classes.buttonSpacing} />
						<Button
							disabled={!enableSendButtons}
							color="primary"
							endIcon={<Phone />}
							variant={enableSendButtons ? 'contained' : 'outlined'}
							onClick={onSendAsCall}>
							Send as Call
						</Button>
					</Fragment>
				)}
				{sendToAppointmentList
				&& (
					<Button
						disabled={!enableSendButtons}
						color="primary"
						endIcon={<Send />}
						variant={enableSendButtons ? 'contained' : 'outlined'}
						onClick={onSendToAppointments}>
						Send
					</Button>
				)}
			</div>
		</div>
	);
}
