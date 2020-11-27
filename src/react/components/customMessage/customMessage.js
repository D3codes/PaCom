import React, { useState, Fragment, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography, Switch, TextField, Divider, List, ListItem, ListItemText, Button
} from '@material-ui/core';
import { Phone, Send, Sms } from '@material-ui/icons';
import clsx from 'clsx';
import BrowseFile from '../browseFile';
import csvImporter from '../../utilities/csvImporter';
import validatePhoneNumber from '../../validators/validatePhoneNumber';
import MessageTemplateComposer from '../messageTemplateComposer';

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
	padding: {
		paddingBottom: 22
	},
	sendToTextFieldContainer: {
	},
	adornmentDivider: {
		margin: theme.spacing()
	},
	messageTemplatesContainer: {
	},
	messageTemplates: {
		maxHeight: 200,
		width: '100%',
		overflow: 'auto'
	},
	composeContainer: {
		flex: 1
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
	const phoneNumberIsValid = useMemo(() => validatePhoneNumber(phoneNumber), [phoneNumber]);
	const enableSendButtons = useMemo(() => (sendToAppointmentList ? !!appointments : phoneNumberIsValid), [phoneNumberIsValid, sendToAppointmentList, appointments]);

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
			<div className={classes.sendToTextFieldContainer}>
				{sendToAppointmentList && <BrowseFile onBrowseClick={handleBrowseClick} filePath={filePath} onFilePathChange={handleFilePathChange} label="Import CSV" />}
				{!sendToAppointmentList
				&& (
					<div className={clsx(classes.sendToTextFieldContainer, { [classes.padding]: phoneNumberIsValid })}>
						<TextField
							fullWidth
							data-testid="phoneNumber-field"
							onChange={event => { setPhoneNumber(event.target.value); }}
							label="Phone Number"
							variant="outlined"
							focused
							helperText={phoneNumberIsValid ? '' : 'Invalid Phone Number'}
							error={!phoneNumberIsValid}
							value={phoneNumber}
							InputProps={{
								startAdornment: (
									<Fragment>
										<Phone color="primary" />
										<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
										<p>+1</p>
									</Fragment>
								)
							}}
						/>
					</div>
				)}
			</div>
			<div className={classes.composeContainer}>
				<div className={classes.messageTemplatesContainer} style={{ float: 'left', width: '33%' }}>
					<Typography color="primary" variant="h5" display="inline">Templates</Typography>
					<List className={classes.messageTemplates} dense={false}>
						<ListItem>
							<ListItemText
								primary="Single-line item"
							/>
						</ListItem>
						<ListItem>
							<ListItemText
								primary="Single-line item"
							/>
						</ListItem>
						<ListItem>
							<ListItemText
								primary="Single-line item"
							/>
						</ListItem>
						<ListItem>
							<ListItemText
								primary="Single-line item"
							/>
						</ListItem>
					</List>
				</div>
				<MessageTemplateComposer style={{ float: 'left', width: '66%' }} />
			</div>
			<div className={classes.actionButtonContainer}>
				{!sendToAppointmentList
				&& (
					<Fragment>
						<Button
							disabled={!enableSendButtons}
							color="primary"
							endIcon={<Sms />}
							variant={enableSendButtons ? 'contained' : 'outlined'}>
							Send as SMS
						</Button>
						<div className={classes.buttonSpacing} />
						<Button
							disabled={!enableSendButtons}
							color="primary"
							endIcon={<Phone />}
							variant={enableSendButtons ? 'contained' : 'outlined'}>
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
						variant={enableSendButtons ? 'contained' : 'outlined'}>
						Send
					</Button>
				)}
			</div>
		</div>
	);
}
