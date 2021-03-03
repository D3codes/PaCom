import React, { useState, Fragment, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography, Switch, List, ListItem, ListItemText, Button, Card, Divider
} from '@material-ui/core';
import { Phone, Send, Sms } from '@material-ui/icons';
import clsx from 'clsx';
import BrowseFile from '../browseFile';
import csvImporter from '../../utilities/csvImporter';
import validatePhoneNumber from '../../validators/validatePhoneNumber';
import MessageTemplateComposer from '../messageTemplates/messageTemplateComposer';
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
	padding: {
		paddingBottom: 22
	},
	sendToTextFieldContainer: {
	},
	adornmentDivider: {
		margin: theme.spacing()
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
	messageTemplates: {
		width: '100%',
		overflowY: 'auto',
		height: '100%'
	},
	composeContainer: {
		flex: 1,
		height: '200px'
	},
	buttonSpacing: {
		marginLeft: theme.spacing()
	},
	messageTemplateComposerContainer: {
		float: 'left',
		width: '66%',
		height: '100%'
	}
}));

const Ehrs = {
	Pulse: 'Pulse'
};

const transformersByEhr = {
	Pulse: fromPulse
};

const selectedEhr = Ehrs.Pulse;

const variables = ['template1', 'template2', 'template3', 'template4', 'template5', 'template6', 'template7', 'template8', 'template9', 'template10', 'template11', 'template12', 'template13'];

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
			<div>
				{sendToAppointmentList && <BrowseFile onBrowseClick={handleBrowseClick} filePath={filePath} onFilePathChange={handleFilePathChange} label="Import CSV" />}
				{!sendToAppointmentList
				&& (
					<div className={clsx(classes.sendToTextFieldContainer, { [classes.padding]: phoneNumberIsValid })}>
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
					<Typography color="primary" variant="h5" display="inline" classNem={classes.templatesText}>Templates</Typography>
					<Card className={classes.messageTemplatesListContainer}>
						<List className={classes.messageTemplates} dense={false}>
							{variables.map(variable => (
								<React.Fragment>
									<ListItem button>
										<ListItemText primary={variable} />
									</ListItem>
									<Divider />
								</React.Fragment>
							))}
						</List>
					</Card>
				</div>
				<div className={classes.messageTemplateComposerContainer}>
					<MessageTemplateComposer />
				</div>
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
