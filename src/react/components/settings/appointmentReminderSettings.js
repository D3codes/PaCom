import React, { useState, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Warning, Block, Save, EventBusy
} from '@material-ui/icons';
import { Typography, Divider, Select, FormControl, MenuItem, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import persistentStorage from '../../utilities/persistentStorage';
import NotificationMethod from './notificationMethod';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	buttonContent: {
		display: 'flex',
		flexDirection: 'column'
	},
	button: {
		marginTop: theme.spacing(),
		marginBottom: theme.spacing()
	},
	adornmentDivider: {
		margin: theme.spacing()
	},
	buttonRoot: {
		textTransform: 'none',
		justifyContent: 'flex-start',
		textAlign: 'left'
	},
	invisibleOutline: {
		borderColor: 'rgba(0,0,0,0)',
		'&:hover': {
			borderColor: 'rgba(0,0,0,0)'
		}
	},
	actionButtonContainer: {
		display: 'flex',
		alignSelf: 'flex-end'
	},
	notificationMethodContainer: {
		flex: 1
	},
	divider: {
		marginTop: theme.spacing(),
		marginBottom: theme.spacing()
	},
	dateVerificationOptions: {
		marginTop: theme.spacing(),
		marginBottom: theme.spacing()
	}
}));

export default function AppointmentRemindersSettings({ appointmentReminders, reloadSettings, hasWritePermission }) {
	const classes = useStyles();
	const [numberOfDays, setNumberOfDays] = useState(appointmentReminders.dateVerification.numberOfDays);
	const [endOfRange, setEndOfRange] = useState(appointmentReminders.dateVerification.endOfRange);
	const [allowSendOutsideRange, setAllowSendOutsideRange] = useState(appointmentReminders.dateVerification.allowSendOutsideRange);
	const [useBusinessDays, setUseBusinessDays] = useState(appointmentReminders.dateVerification.useBusinessDays);
	const [sendToPreferredAndSms, setSendToPreferredAndSms] = useState(appointmentReminders.notificationMethod.sendToPreferredAndSms);
	const [textHomeIfCellNotAvailable, setTextHomeIfCellNotAvailable] = useState(appointmentReminders.notificationMethod.textHomeIfCellNotAvailable);

	const changesToSave = useMemo(() => (
		allowSendOutsideRange !== appointmentReminders.dateVerification.allowSendOutsideRange
		|| numberOfDays !== appointmentReminders.dateVerification.numberOfDays
		|| endOfRange !== appointmentReminders.dateVerification.endOfRange
		|| useBusinessDays !== appointmentReminders.dateVerification.useBusinessDays
		|| sendToPreferredAndSms !== appointmentReminders.notificationMethod.sendToPreferredAndSms
		|| textHomeIfCellNotAvailable !== appointmentReminders.notificationMethod.textHomeIfCellNotAvailable
	), [allowSendOutsideRange, numberOfDays, endOfRange, useBusinessDays, sendToPreferredAndSms, textHomeIfCellNotAvailable, appointmentReminders]);
	
	const handleSave = () => {
		if(allowSendOutsideRange !== appointmentReminders.dateVerification.allowSendOutsideRange) persistentStorage.setAllowSendOutsideRange(allowSendOutsideRange);
		if(numberOfDays !== appointmentReminders.dateVerification.numberOfDays) persistentStorage.setNumberOfDays(numberOfDays);
		if(endOfRange !== appointmentReminders.dateVerification.endOfRange) persistentStorage.setEndOfRange(endOfRange);
		if(useBusinessDays !== appointmentReminders.dateVerification.useBusinessDays) persistentStorage.setUseBusinessDays(useBusinessDays);
		if(sendToPreferredAndSms !== appointmentReminders.notificationMethod.sendToPreferredAndSms) persistentStorage.setSendToPreferredAndSmsForReminders(sendToPreferredAndSms);
		if(textHomeIfCellNotAvailable !== appointmentReminders.notificationMethod.textHomeIfCellNotAvailable) persistentStorage.setTextHomeIfCellNotAvailableForReminders(textHomeIfCellNotAvailable);
		reloadSettings();
	}

	return (
		<div className={classes.root}>
			<div className={classes.dateVerificationContainer}>
				<Typography color="primary" variant="h4">Date Verification</Typography>
				<div className={classes.dateVerificationOptions}>
					<Typography color="primary" variant="h5" display="inline">Reminders should be sent  </Typography>
					<FormControl>
						<Select
						value={!endOfRange}
						onChange={event => {setEndOfRange(endOfRange ? undefined : numberOfDays+1);}}
						inputProps={{ 'aria-label': 'Without label' }}
						>
						<MenuItem value={true}>Exactly</MenuItem>
						<MenuItem value={false}>Between</MenuItem>
						</Select>
					</FormControl>
					<Typography variant="h5" display="inline">  </Typography>
					<TextField
						type="number" 
						value={numberOfDays}
						style={{width: 30}}
						onChange={event => {setNumberOfDays(parseInt(event.target.value))}}
						InputProps={{ inputProps: { min: 0 } }}
					/>
					{ endOfRange && <>
						<Typography color="primary" variant="h5" display="inline" style={{bottom: 0}}>  to  </Typography>
						<TextField
							type="number"
							value={endOfRange}
							style={{width: 30}}
							onChange={event => {setEndOfRange(parseInt(event.target.value))}}
							InputProps={{ inputProps: { min: numberOfDays+1 } }}
						/>
					</>
					}
					<Typography variant="h5" display="inline">  </Typography>
					<FormControl>
						<Select
						value={useBusinessDays}
						onChange={event => {setUseBusinessDays(event.target.value)}}
						inputProps={{ 'aria-label': 'Without label' }}
						>
						<MenuItem value={false}>day(s)</MenuItem>
						<MenuItem value={true}>business day(s)</MenuItem>
						</Select>
					</FormControl>
					<Typography color="primary" variant="h5" display="inline">  before appointment.</Typography>
				</div>
				<div>
					<Button
						onClick={() => { setAllowSendOutsideRange(0); }}
						className={classes.button}
						color="primary"
						style={{width:'100%'}}
						classes={{ root: classes.buttonRoot, outlinedPrimary: allowSendOutsideRange === 0 ? '' : classes.invisibleOutline }}
						variant="outlined"
						startIcon={(
							<Fragment>
								<EventBusy style={{ fontSize: '3rem', textAlign: 'left' }} />
								<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
							</Fragment>
						)}>
						<div className={classes.buttonContent}>
							<Typography variant="h5">Off</Typography>
							<Typography>Do not verify the date before sending reminders.</Typography>
						</div>
					</Button>
					<Button
						onClick={() => { setAllowSendOutsideRange(1); }}
						className={classes.button}
						color="primary"
						style={{width:'100%'}}
						classes={{ root: classes.buttonRoot, outlinedPrimary: allowSendOutsideRange === 1? '' : classes.invisibleOutline }}
						variant="outlined"
						startIcon={(
							<Fragment>
								<Warning style={{ fontSize: '3rem', textAlign: 'left' }} />
								<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
							</Fragment>
						)}>
						<div className={classes.buttonContent}>
							<Typography variant="h5">Warning</Typography>
							<Typography>Show warning if reminders are sent outside of specified time.</Typography>
						</div>
					</Button>
					<Button
						onClick={() => { setAllowSendOutsideRange(2); }}
						className={classes.button}
						color="primary"
						style={{width:'100%'}}
						classes={{ root: classes.buttonRoot, outlinedPrimary: allowSendOutsideRange === 2 ? '' : classes.invisibleOutline }}
						variant="outlined"
						startIcon={(
							<Fragment>
								<Block style={{ fontSize: '3rem', textAlign: 'left' }} />
								<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
							</Fragment>
						)}>
						<div className={classes.buttonContent}>
							<Typography variant="h5">Block</Typography>
							<Typography >Do not allow reminders to be sent outside of specified time.</Typography>
						</div>
					</Button>
				</div>
			</div>
			<Divider className={classes.divider}/>
			<div className={classes.notificationMethodContainer}>
				<NotificationMethod
					sendToPreferredAndSms={sendToPreferredAndSms}
					setSendToPreferredAndSms={setSendToPreferredAndSms}
					textHomeIfCellNotAvailable={textHomeIfCellNotAvailable}
					setTextHomeIfCellNotAvailable={setTextHomeIfCellNotAvailable}
					reloadSettings={reloadSettings}
				/>
			</div>
			<div className={classes.actionButtonContainer}>
				<Button
					disabled={!changesToSave}
					endIcon={<Save />}
					color="primary"
					variant={changesToSave ? 'contained' : 'outlined'}
					onClick={handleSave}>
						Save
				</Button>
			</div>
		</div>
	);
}

AppointmentRemindersSettings.propTypes = {
	appointmentReminders: PropTypes.shape(
		{
			dateVerification: {
				numberOfDays: PropTypes.number,
				endOfRange: PropTypes.number,
				allowSendOutsideRange: PropTypes.number,
				useBusinessDays: PropTypes.bool
			},
			notificationMethod: {
				sendToPreferredAndSms: PropTypes.bool,
				textHomeIfCellNotAvailable: PropTypes.bool
			}
		}
	).isRequired,
	reloadSettings: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired
};
