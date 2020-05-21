/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
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

export default function Settings() {
	const classes = useStyles();
	const [sid, setSid] = useState('');
	const [authToken, setAuthToken] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [callEndpoint, setCallEndpoint] = useState('');
	const [smsEndpoint, setSmsEndpoint] = useState('');
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [selectedDate, setSelectedDate] = React.useState(
		new Date('2020-08-18T21:11:54')
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
			setPhoneNumber(validatePhoneNumber(settings.twilio.phoneNumber));
			setCallEndpoint(validateTwilioEndpoint(settings.twilio.callEndpoint));
			setSmsEndpoint(validateTwilioEndpoint(settings.twilio.smsEndpoint));
		});
	}, []);

	const handlePhoneNumberChange = (event) => {
		setPhoneNumber(validatePhoneNumber(event.target.value));
	};

	const handleCallEndpointChange = (event) => {
		setCallEndpoint(validateTwilioEndpoint(event.target.value));
	};

	const handleSmsEndpointChange = (event) => {
		setSmsEndpoint(validateTwilioEndpoint(event.target.value));
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
				<TextField
					fullWidth
					id="sid-field"
					label="SID"
					variant="outlined"
					value={sid}
					onChange={event => setSid(event.target.value)}
					InputProps={{
						startAdornment: <React.Fragment>
											<VpnKey color="primary" />
											<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
										</React.Fragment>
					}}
				/>
				<TextField
					fullWidth
					id="authToken-field"
					label="Authorization Token"
					variant="outlined"
					value={authToken}
					onChange={event => setAuthToken(event.target.value)}
					InputProps={{
						startAdornment: <React.Fragment>
											<Security color="primary" />
											<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
										</React.Fragment>
					}}
				/>
				<TextField
					fullWidth
					id="phoneNumber-field"
					onChange={handlePhoneNumberChange}
					label="Phone Number"
					variant="outlined"
					helperText={phoneNumber ? '' : 'Invalid Phone Number'}
					error={!phoneNumber}
					value={phoneNumber}
					InputProps={{
						startAdornment: <React.Fragment>
											<Phone color="primary" />
											<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
											<p>+1</p>
										</React.Fragment>
					}}
				/>
				<TextField
					fullWidth
					id="callEndpoint-field"
					label="Call Endpoint"
					variant="outlined"
					helperText={callEndpoint ? '' : 'Invalid Endpoint'}
					error={!callEndpoint}
					value={callEndpoint}
					onChange={handleCallEndpointChange}
					InputProps={{
						startAdornment: <React.Fragment>
											<Language color="primary" />
											<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
										</React.Fragment>
					}}
				/>
				<TextField
					fullWidth
					id="smsEndpoint-field"
					label="SMS Endpoint"
					variant="outlined"
					helperText={smsEndpoint ? '' : 'Invalid Endpoint'}
					error={!smsEndpoint}
					value={smsEndpoint}
					onChange={handleSmsEndpointChange}
					InputProps={{
						startAdornment: <React.Fragment>
											<Language color="primary" />
											<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
										</React.Fragment>
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
