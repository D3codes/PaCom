import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import { Button, Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
	Save, CloudDownload, Language, Phone, VpnKey, Security
} from '@material-ui/icons';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker
} from '@material-ui/pickers';
import clsx from 'clsx';
import validatePhoneNumber from '../../validators/validatePhoneNumber';
import validateTwilioEndpoint from '../../validators/validateTwilioEndpoint';
import persistentStorage from '../../utilities/persistentStorage';
import IconTextField from '../iconTextField';
import twilioClient from '../../utilities/twilioClient';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	form: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1)
		},
		flex: 1
	},
	content: {
		display: 'block',
		padding: theme.spacing(2)
	},
	buttonContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	downloadButtonContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: theme.spacing(2)
	},
	popover: {
		marginLeft: theme.spacing(3),
		marginTop: theme.spacing()
	},
	popoverInner: {
		border: `3px solid ${theme.palette.primary.main}`
	},
	padding: {
		paddingBottom: 22
	}
}));

export default function TwilioSettings({ twilio, reloadSettings, hasWritePermission }) {
	const classes = useStyles();
	const [sid, setSid] = useState(twilio.SID);
	const [authToken, setAuthToken] = useState(twilio.authToken);
	const [phoneNumber, setPhoneNumber] = useState(twilio.phoneNumber);
	const [callEndpoint, setCallEndpoint] = useState(twilio.callEndpoint);
	const [smsEndpoint, setSmsEndpoint] = useState(twilio.smsEndpoint);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedDate, setSelectedDate] = useState(new Date());

	const phoneNumberIsValid = useMemo(() => validatePhoneNumber(phoneNumber), [phoneNumber]);
	const callEndpointIsValid = useMemo(() => validateTwilioEndpoint(callEndpoint), [callEndpoint]);
	const smsEndpointIsValid = useMemo(() => validateTwilioEndpoint(smsEndpoint), [smsEndpoint]);
	const changesToSave = useMemo(() => (
		sid !== twilio.SID
		|| authToken !== twilio.authToken
		|| phoneNumber !== twilio.phoneNumber
		|| callEndpoint !== twilio.callEndpoint
		|| smsEndpoint !== twilio.smsEndpoint
	), [sid, authToken, phoneNumber, callEndpoint, smsEndpoint, twilio]);

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const handleSave = () => {
		if (authToken !== twilio.authToken) persistentStorage.setTwilioAuthToken(authToken);
		if (sid !== twilio.SID) persistentStorage.setTwilioSID(sid);
		if (phoneNumber !== twilio.phoneNumber) persistentStorage.setTwilioPhoneNumber(phoneNumber);
		if (callEndpoint !== twilio.callEndpoint) persistentStorage.setTwilioCallEndpoint(callEndpoint);
		if (smsEndpoint !== twilio.smsEndpoint) persistentStorage.setTwilioSmsEndpoint(smsEndpoint);
		reloadSettings();
	};

	const handleDownloadMessages = async () => {
		const logs = await twilioClient.getSMSLogs(selectedDate);
		// eslint-disable-next-line no-console
		console.log(logs);
		// TODO: Save to file
	};

	const handleDownloadCalls = async () => {
		const logs = await twilio.getCallLogs(selectedDate);
		// eslint-disable-next-line no-console
		console.log(logs);
		// TODO: Save to file
	};

	return (
		<div className={classes.root}>
			<form className={classes.form} noValidate autoComplete="off">
				<div className={classes.padding}>
					<IconTextField
						disabled={!hasWritePermission}
						testId="sid-field"
						label="SID"
						value={sid}
						onChange={setSid}
						Icon={VpnKey}
					/>
				</div>
				<div className={classes.padding}>
					<IconTextField
						disabled={!hasWritePermission}
						id="authToken-field"
						label="Authorization Token"
						value={authToken}
						onChange={setAuthToken}
						Icon={Security}
					/>
				</div>
				<div className={clsx({ [classes.padding]: phoneNumberIsValid })}>
					<IconTextField
						disabled={!hasWritePermission}
						testId="phoneNumber-field"
						onChange={setPhoneNumber}
						label="Phone Number"
						helperText={phoneNumberIsValid ? '' : 'Invalid Phone Number'}
						error={!phoneNumberIsValid}
						value={phoneNumber}
						Icon={Phone}
						startAdornment="+1"
					/>
				</div>
				<div className={clsx({ [classes.padding]: callEndpointIsValid })}>
					<IconTextField
						disabled={!hasWritePermission}
						id="callEndpoint-field"
						label="Call Endpoint"
						helperText={callEndpointIsValid ? '' : 'Invalid Endpoint'}
						error={!callEndpointIsValid}
						value={callEndpoint}
						onChange={setCallEndpoint}
						Icon={Language}
					/>
				</div>
				<div className={clsx({ [classes.padding]: smsEndpointIsValid })}>
					<IconTextField
						disabled={!hasWritePermission}
						id="smsEndpoint-field"
						label="SMS Endpoint"
						helperText={smsEndpointIsValid ? '' : 'Invalid Endpoint'}
						error={!smsEndpointIsValid}
						value={smsEndpoint}
						onChange={setSmsEndpoint}
						Icon={Language}
					/>
				</div>
			</form>
			<div className={classes.buttonContainer}>
				<div className={classes.root}>
					<Button
						className={classes.button}
						startIcon={<CloudDownload />}
						aria-describedby={id}
						variant="contained"
						color="primary"
						onClick={handleClick}>
						Download Logs
					</Button>
					<Popover
						className={classes.popover}
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center'
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center'
						}}>
						<div className={classes.popoverInner}>
							<div className={classes.content}>
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<KeyboardDatePicker
										disableToolbar
										autoOk
										variant="inline"
										format="MM/dd/yyyy"
										margin="normal"
										id="date-picker-inline"
										label="Date"
										value={selectedDate}
										onChange={handleDateChange}
										KeyboardButtonProps={{
											'aria-label': 'change date'
										}}
									/>
								</MuiPickersUtilsProvider>
							</div>
							<div className={classes.downloadButtonContainer}>
								<Button
									onClick={() => { handleDownloadCalls(); }}
									variant="contained"
									color="primary">
									Call Logs
								</Button>
								<Button
									onClick={() => { handleDownloadMessages(); }}
									variant="contained"
									color="primary">
									SMS Logs
								</Button>
							</div>
						</div>
					</Popover>
				</div>
				<Button
					disabled={!hasWritePermission || !changesToSave || !phoneNumberIsValid || !smsEndpointIsValid || !callEndpointIsValid}
					endIcon={<Save />}
					color="primary"
					variant={!hasWritePermission || !changesToSave || !phoneNumberIsValid || !smsEndpointIsValid || !callEndpointIsValid ? 'outlined' : 'contained'}
					onClick={handleSave}>
						Save
				</Button>
			</div>
		</div>
	);
}

TwilioSettings.propTypes = {
	twilio: PropTypes.shape(
		{
			SID: PropTypes.string,
			authToken: PropTypes.string,
			phoneNumber: PropTypes.string,
			callEndpoint: PropTypes.string,
			smsEndpoint: PropTypes.string
		}.isRequired
	),
	reloadSettings: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired
};
