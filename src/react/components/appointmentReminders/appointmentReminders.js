import React from 'react';
import {
	Button, makeStyles, TextField, InputAdornment
} from '@material-ui/core';
import { Folder } from '@material-ui/icons';

import ReportTable from '../reportTable/reportTable';

// models
import Appointment from '../../models/appointment';
import ContactMethod from '../../models/conactMethod';
import Patient from '../../models/patient';
import Provider from '../../models/provider';
import Reminder from '../../models/reminder';

const useStyles = makeStyles((theme) => ({
	actionContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	browseContainer: {
		display: 'flex'
	},
	browseIcon: {
		color: theme.palette.primary.main
	},
	button: {
		marginLeft: theme.spacing(2)
	},
	root: {
		display: 'flex',
		flexFlow: 'column',
		height: '100%'
	}
}));

const reminder = new Reminder(
	new Patient(
		'12345678',
		'Caullen R Sasnett',
		[
			new ContactMethod(
				'9136838736',
				'Cell'
			)
		],
		'Cell',
		'01/11/1995'
	),
	new Appointment(
		'05/29/2020',
		'8:00 AM',
		new Provider(
			'Source text for Doctor David Freeman',
			'David Freeman',
			'David Freeman'
		),
		'90'
	)
);

const reminders = Array(25).fill(reminder);

export default function AppointmentReminders() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<div className={classes.browseContainer}>
				<TextField
					focused
					fullWidth
					InputProps={{
						notched: true,
						readOnly: true,
						startAdornment: (
							<InputAdornment className={classes.browseIcon} position="start"><Folder /></InputAdornment>
						)
					}}
					label="Import CSV"
					size="small"
					variant="outlined"
				/>
				<Button className={classes.button} color="primary" variant="contained">Browse</Button>
			</div>
			<ReportTable reminders={reminders} />
		</div>
	);
}
