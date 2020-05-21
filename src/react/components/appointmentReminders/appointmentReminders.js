import React from 'react';
import { makeStyles } from '@material-ui/core';

import BrowseFile from '../browseFile';
import ReportTable from '../reportTable/reportTable';

import Appointment from '../../models/appointment';
import ContactMethod from '../../models/conactMethod';
import Patient from '../../models/patient';
import Provider from '../../models/provider';
import Reminder from '../../models/reminder';

const useStyles = makeStyles(() => ({
	appointmentRemindersContainer: {
		display: 'flex',
		flexFlow: 'column',
		height: '100%'
	}
}));

const reminders = [
	new Reminder(
		new Patient(
			'1234567',
			'Caullen R Sasnett',
			[new ContactMethod(
				'+19136838736',
				'Cell'
			)],
			'Cell',
			'01/11/1995'
		),
		new Appointment(
			'01/01/1970',
			'12:00 AM',
			new Provider(
				'Source for Doctor David Freeman',
				'David Freeman',
				'David Freeman'
			),
			'90'
		)
	)
];

function AppointmentReminders() {
	const classes = useStyles();
	return (
		<div className={classes.appointmentRemindersContainer}>
			<BrowseFile />
			<ReportTable reminders={reminders} />
		</div>
	);
}

export default AppointmentReminders;
