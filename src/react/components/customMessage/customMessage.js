import React, { useState, Fragment, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Switch, TextField, Divider } from '@material-ui/core';
import { Phone } from '@material-ui/icons';
import BrowseFile from '../browseFile';
import csvImporter from '../../utilities/csvImporter';
import validatePhoneNumber from '../../validators/validatePhoneNumber';

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
	},
	adornmentDivider: {
		margin: theme.spacing()
	}
}));

const Ehrs = {
	Pulse: 'Pulse'
};

const transformersByEhr = {
	Pulse: fromPulse
};

const selectedEhr = Ehrs.Pulse;

export default function CustomMessage() {
	const classes = useStyles();
	const [checked, setChecked] = useState(false);
	const [appointments, setAppointments] = useState(null);
	const [filePath, setFilePath] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const phoneNumberIsValid = useMemo(() => validatePhoneNumber(phoneNumber), [phoneNumber]);

	const handleSwitch = event => {
		setChecked(event.target.checked);
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
					checked={checked}
					onChange={handleSwitch}
					color="default"
				/>
				<Typography color="primary" variant="h5" display="inline">Send To Appointment List</Typography>
			</div>
			<div>
				{checked && <BrowseFile onBrowseClick={handleBrowseClick} filePath={filePath} onFilePathChange={handleFilePathChange} label="Import CSV" />}
				{!checked
				&& (
					<TextField
						fullWidth
						data-testid="phoneNumber-field"
						onChange={event => { setPhoneNumber(event.target.value); }}
						label="Phone Number"
						variant="outlined"
						focused
						helperText={phoneNumberIsValid ? '' : 'Invalid Phone Number'}
						error={!phoneNumberIsValid}
						value={phoneNumber}
						InputProps={{
							startAdornment: (
								<Fragment>
									<Phone color="primary" />
									<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
									<p>+1</p>
								</Fragment>
							)
						}}
					/>
				)}
			</div>
			<div>
				Compose View
			</div>
			<div>
				Send Buttons
			</div>
		</div>
	);
}
