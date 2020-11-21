import React, { useState, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Warning, Block, Save
} from '@material-ui/icons';
import { Typography, Divider, Select, FormControl, MenuItem, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
		justifyContent: 'space-between'
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

	const [selectedOption, setSelectedOption] = useState(allowSendOutsideRange);
	const changesToSave = useMemo(() => (
		selectedOption !== appointmentReminders.allowSendOutsideRange
	), [selectedOption, appointmentReminders]);
	
	const handleSave = () => {
		
	}

	return (
		<div className={classes.root}>
			<div className={classes.notificationMethodContainer}>
				<NotificationMethod notificationMethod={appointmentReminders.notificationMethod} reloadSettings={reloadSettings}/>
			</div>
			<Divider />
			<div className={classes.dateVerificationContainer}>
				<div>
					<Typography color="primary" variant="h4">Date Verification</Typography>
					<Typography variant="h5">Reminders should be sent</Typography>
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
				<div>
					<Button
						onClick={() => { setSelectedOption(true); }}
						className={classes.button}
						color="primary"
						style={{width:'100%'}}
						classes={{ root: classes.buttonRoot, outlinedPrimary: selectedOption ? '' : classes.invisibleOutline }}
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
						onClick={() => { setSelectedOption(false); }}
						className={classes.button}
						color="primary"
						style={{width:'100%'}}
						classes={{ root: classes.buttonRoot, outlinedPrimary: selectedOption ? classes.invisibleOutline : '' }}
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
