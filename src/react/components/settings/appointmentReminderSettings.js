import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider, Select, FormControl, MenuItem, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NotificationMethod from './notificationMethod';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
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

	return (
		<div className={classes.root}>
			<div className={classes.notificationMethodContainer}>
				<NotificationMethod notificationMethod={appointmentReminders.notificationMethod} reloadSettings={reloadSettings}/>
			</div>
			<Divider />
			<div className={classes.dateVerificationContainer}>
				<Typography variant="h5">Date Verification</Typography>
				<Typography variant="h5">Reminders should be sent</Typography>
				<FormControl>
					<Select
					value={!endOfRange}
					onChange={event => {setEndOfRange(endOfRange ? undefined : 5);}}
					inputProps={{ 'aria-label': 'Without label' }}
					>
					<MenuItem value={true}>Exactly</MenuItem>
					<MenuItem value={false}>Between</MenuItem>
					</Select>
				</FormControl>
				<Typography display="inline"> </Typography>
				<TextField
					type="number"
					value={numberOfDays}
					style={{width: 35}}
					onChange={event => {setNumberOfDays(parseInt(event.target.value))}}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				{ endOfRange && <>
					<Typography variant="h5" display="inline" style={{bottom: 0}}> to </Typography>
					<TextField
						type="number"
						value={endOfRange}
						style={{width: 35}}
						onChange={event => {setEndOfRange(parseInt(event.target.value))}}
						InputProps={{ inputProps: { min: numberOfDays+1 } }}
					/>
				</>
				}
				<Typography display="inline"> </Typography>
				<FormControl>
					<Select
					value={!useBusinessDays}
					onChange={event => {}}
					inputProps={{ 'aria-label': 'Without label' }}
					>
					<MenuItem value={true}>day(s)</MenuItem>
					<MenuItem value={false}>business day(s)</MenuItem>
					</Select>
				</FormControl>
				<Typography variant="h5">before appointment.</Typography>
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
				allowSendOutsideRange: PropTypes.bool,
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
