import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import toPhoneNumber from '../../transformers/toPhoneNumber';
import persistantStorage from '../../utilities/persistantStorage';
import { Save } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '75ch'
		}
	},
	saveButton: {
		margin: theme.spacing(1)
	}
}));

export default function Settings() {
	const classes = useStyles();
	const [sid, setSid] = useState('');
	const [authToken, setAuthToken] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [callEndpoint, setCallEndpoint] = useState('');
	const [smsEndpoint, setSmsEndpoint] = useState('');

	useEffect(() => {
		persistantStorage.getSettings().then(settings => {
			setSid(settings.twilio.SID);
			setAuthToken(settings.twilio.authToken);
			setPhoneNumber(toPhoneNumber(settings.twilio.phoneNumber));
			setCallEndpoint(settings.twilio.callEndpoint);
			setSmsEndpoint(settings.twilio.smsEndpoint);
		});
	}, []);

	const handlePhoneNumberChange = (event) => {
		setPhoneNumber(toPhoneNumber(event.target.value));
	};

	const handleSave = () => {
		persistantStorage.setTwilioAuthToken(authToken);
		persistantStorage.setTwilioSID(sid);
		persistantStorage.setTwilioPhoneNumber(phoneNumber);
		persistantStorage.setTwilioCallEndpoint(callEndpoint);
		persistantStorage.setTwilioSmsEndpoint(smsEndpoint);
	};

	return (
		<>
			<form className={classes.root} noValidate autoComplete="off">
				<TextField id="sid-field" label="SID" variant="outlined" value={sid} onChange={event => setSid(event.target.value)} />
				<TextField id="authToken-field" label="Authorization Token" variant="outlined" value={authToken} onChange={event => setAuthToken(event.target.value)} />
				<TextField
					id="phoneNumber-field"
					onChange={handlePhoneNumberChange}
					label="Phone Number"
					variant="outlined"
					helperText={phoneNumber ? '' : 'Invalid Phone Number'}
					error={!phoneNumber}
					value={phoneNumber}
				/>
				<TextField id="callEndpoint-field" label="Call Endpoint" variant="outlined" value={callEndpoint} onChange={event => setCallEndpoint(event.target.value)} />
				<TextField id="smsEndpoint-field" label="SMS Endpoint" variant="outlined" value={smsEndpoint} onChange={event => setSmsEndpoint(event.target.value)} />
			</form>
			<Button className={classes.saveButton} startIcon={<Save />} color="primary" variant="contained" onClick={handleSave}>Save</Button>
		</>
	);
}
