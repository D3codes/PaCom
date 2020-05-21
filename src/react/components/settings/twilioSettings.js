import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { TextField, Button, Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Save, CloudDownload } from '@material-ui/icons';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker
} from '@material-ui/pickers';
import toPhoneNumber from '../../transformers/toPhoneNumber';
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
	buttonContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	}
}));

export default function Settings() {
	const classes = useStyles();
	const [sid, setSid] = useState('');
	const [authToken, setAuthToken] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [callEndpoint, setCallEndpoint] = useState('');
	const [smsEndpoint, setSmsEndpoint] = useState('');
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [selectedDate, setSelectedDate] = React.useState(
		new Date('2014-08-18T21:11:54')
	);

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
			<form className={classes.form} noValidate autoComplete="off">
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
				<TextField
					fullWidth
					id="callEndpoint-field"
					label="Call Endpoint"
					variant="outlined"
					value={callEndpoint}
					onChange={event => setCallEndpoint(event.target.value)}
				/>
				<TextField fullWidth id="smsEndpoint-field" label="SMS Endpoint" variant="outlined" value={smsEndpoint} onChange={event => setSmsEndpoint(event.target.value)} />
			</form>
			<div className={classes.buttonContainer}>
				<div className={classes.root}>
					<Button
						className={classes.button}
						startIcon={<CloudDownload />}
						aria-describedby={id}
						variant="contained"
						color="primary"
						onClick={handleClick}
					>
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
						}}
					>
						<div className={classes.content}>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									disableToolbar
									variant="inline"
									format="MM/dd/yyyy"
									margin="normal"
									id="date-picker-inline"
									label="Date picker inline"
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
				<Button endIcon={<Save />} color="primary" variant="contained" onClick={handleSave}>Save</Button>
			</div>
		</div>
	);
}
