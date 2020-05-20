import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import toPhoneNumber from '../../transformers/toPhoneNumber';
import persistantStorage from '../../utilities/persistantStorage';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexFlow: 'column',
		height: '100%'
	},
	form: {
		display: 'flex'
	},
	saveButtonDiv: {
		flexFlow: 'column',
		display: 'flex',
		flex: 1
	},
	saveButton: {
		display: 'flex'
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
		<div className={classes.root}>
			<div className={classes.form}>
				<TextField fullWidth id="sid-field" label="SID" variant="outlined" value={sid} onChange={event => setSid(event.target.value)} />
				<TextField fullWidth id="authToken-field" label="Authorization Token" variant="outlined" value={authToken} onChange={event => setAuthToken(event.target.value)} />
				<TextField
					fullWidth
					id="phoneNumber-field"
					onChange={handlePhoneNumberChange}
					label="Phone Number"
					variant="outlined"
					helperText={phoneNumber ? '' : 'Invalid Phone Number'}
					error={!phoneNumber}
					value={phoneNumber}
				/>
				<TextField fullWidth id="callEndpoint-field" label="Call Endpoint" variant="outlined" value={callEndpoint} onChange={event => setCallEndpoint(event.target.value)} />
				<TextField fullWidth id="smsEndpoint-field" label="SMS Endpoint" variant="outlined" value={smsEndpoint} onChange={event => setSmsEndpoint(event.target.value)} />
			</div>
			<div className={classes.saveButtonDiv}>
				<Button color="primary" onClick={handleSave} variant="contained">Save</Button>
			</div>
		</div>
	);
}
