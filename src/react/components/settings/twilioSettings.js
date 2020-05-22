import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import {
	TextField, Button, Popover, Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
	Save, CloudDownload, Language, Phone, VpnKey, Security
} from '@material-ui/icons';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker
} from '@material-ui/pickers';
import validatePhoneNumber from '../../utilities/validatePhoneNumber';
import validateTwilioEndpoint from '../../utilities/validateTwilioEndpoint';
import persistantStorage from '../../utilities/persistantStorage';

const useStyles = makeStyles((theme) => ({
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
		padding: theme.spacing(1)
	},
	buttonContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: theme.spacing(1)
	},
	adornmentDivider: {
		margin: theme.spacing()
	}
}));

export default function TwilioSettings({ twilio, reloadSettings }) {
	const classes = useStyles();
	const [sid, setSid] = useState(twilio.SID);
	const [authToken, setAuthToken] = useState(twilio.authToken);
	const [phoneNumber, setPhoneNumber] = useState(twilio.phoneNumber);
	const [phoneNumberIsValid, setPhoneNumberIsValid] = useState(true);
	const [callEndpoint, setCallEndpoint] = useState(twilio.callEndpoint);
	const [callEndpointIsValid, setCallEndpointIsValid] = useState(true);
	const [smsEndpoint, setSmsEndpoint] = useState(twilio.smsEndpoint);
	const [smsEndpointIsValid, setSmsEndpointIsValid] = useState(true);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [changesToSave, setChangesToSave] = useState(false);

	useEffect(() => {
		setPhoneNumberIsValid(validatePhoneNumber(phoneNumber));
		setCallEndpointIsValid(validateTwilioEndpoint(callEndpoint));
		setSmsEndpointIsValid(validateTwilioEndpoint(smsEndpoint));
	}, []);

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

	const handlePhoneNumberChange = (event) => {
		setPhoneNumber(event.target.value);
		setPhoneNumberIsValid(validatePhoneNumber(event.target.value));
		setChangesToSave(event.target.value !== twilio.phoneNumber);
	};

	const handleCallEndpointChange = (event) => {
		setCallEndpoint(event.target.value);
		setCallEndpointIsValid(validateTwilioEndpoint(event.target.value));
		setChangesToSave(event.target.value !== twilio.callEndpoint);
	};

	const handleSmsEndpointChange = (event) => {
		setSmsEndpoint(event.target.value);
		setSmsEndpointIsValid(validateTwilioEndpoint(event.target.value));
		setChangesToSave(event.target.value !== twilio.smsEndpoint);
	};

	const handleSidChange = (event) => {
		setSid(event.target.value);
		setChangesToSave(event.target.value !== twilio.SID);
	};

	const handleAuthTokenChange = (event) => {
		setAuthToken(event.target.value);
		setChangesToSave(event.target.value !== twilio.authToken);
	};

	const handleSave = () => {
		persistantStorage.setTwilioAuthToken(authToken);
		persistantStorage.setTwilioSID(sid);
		persistantStorage.setTwilioPhoneNumber(phoneNumber);
		persistantStorage.setTwilioCallEndpoint(callEndpoint);
		persistantStorage.setTwilioSmsEndpoint(smsEndpoint);
		reloadSettings();
	};

	return (
		<div className={classes.root}>
			<form className={classes.form} noValidate autoComplete="off">
				<TextField
					fullWidth
					id="sid-field"
					label="SID"
					variant="outlined"
					value={sid}
					onChange={handleSidChange}
					InputProps={{
						startAdornment: (
							<React.Fragment>
								<VpnKey color="primary" />
								<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
							</React.Fragment>
						)
					}}
				/>
				<TextField
					fullWidth
					id="authToken-field"
					label="Authorization Token"
					variant="outlined"
					value={authToken}
					onChange={handleAuthTokenChange}
					InputProps={{
						startAdornment: (
							<React.Fragment>
								<Security color="primary" />
								<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
							</React.Fragment>
						)
					}}
				/>
				<TextField
					fullWidth
					id="phoneNumber-field"
					onChange={handlePhoneNumberChange}
					label="Phone Number"
					variant="outlined"
					helperText={phoneNumberIsValid ? '' : 'Invalid Phone Number'}
					error={!phoneNumberIsValid}
					value={phoneNumber}
					InputProps={{
						startAdornment: (
							<React.Fragment>
								<Phone color="primary" />
								<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
								<p>+1</p>
							</React.Fragment>
						)
					}}
				/>
				<TextField
					fullWidth
					id="callEndpoint-field"
					label="Call Endpoint"
					variant="outlined"
					helperText={callEndpointIsValid ? '' : 'Invalid Endpoint'}
					error={!callEndpointIsValid}
					value={callEndpoint}
					onChange={handleCallEndpointChange}
					InputProps={{
						startAdornment: (
							<React.Fragment>
								<Language color="primary" />
								<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
							</React.Fragment>
						)
					}}
				/>
				<TextField
					fullWidth
					id="smsEndpoint-field"
					label="SMS Endpoint"
					variant="outlined"
					helperText={smsEndpointIsValid ? '' : 'Invalid Endpoint'}
					error={!smsEndpointIsValid}
					value={smsEndpoint}
					onChange={handleSmsEndpointChange}
					InputProps={{
						startAdornment: (
							<React.Fragment>
								<Language color="primary" />
								<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
							</React.Fragment>
						)
					}}
				/>
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
						<div className={classes.content}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									disableToolbar
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
						<div className={classes.buttonContainer}>
							<Button variant="contained" color="primary">
								Call Logs
							</Button>
							<Button variant="contained" color="primary">
								SMS Logs
							</Button>
						</div>
					</Popover>
				</div>
				<Button
					disabled={!changesToSave || !phoneNumberIsValid || !smsEndpointIsValid || !callEndpointIsValid}
					endIcon={<Save />}
					color="primary"
					variant={(changesToSave && phoneNumberIsValid && smsEndpointIsValid && callEndpointIsValid) ? 'contained' : 'outlined'}
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
		}
	),
	reloadSettings: PropTypes.func
};
