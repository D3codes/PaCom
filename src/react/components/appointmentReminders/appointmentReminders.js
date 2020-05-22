import React from 'react';
import { makeStyles } from '@material-ui/core';

import BrowseFile from '../browseFile';
import ReportTable from '../reportTable/reportTable';

const useStyles = makeStyles(() => ({
	appointmentRemindersContainer: {
		display: 'flex',
		flexFlow: 'column',
		height: '100%'
	}
}));

function AppointmentReminders() {
	const classes = useStyles();

	return (
		<div className={classes.appointmentRemindersContainer}>
			<BrowseFile />
			<ReportTable />
		</div>
	);
}

export default AppointmentReminders;
