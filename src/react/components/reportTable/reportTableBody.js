import React from 'react';
import PropTypes from 'prop-types';
import {
	makeStyles, TableBody, TableCell, TableRow, Typography
} from '@material-ui/core';

import Reminder from '../../models/reminder';

const UNKNOWN = 'Unknown';

const useStyles = makeStyles((theme) => ({
	tableCell: {
		padding: theme.spacing(1, 0)
	}
}));

function ReportTableBody({ reminders }) {
	const classes = useStyles();
	return (
		<TableBody>
			{reminders.map((reminder) => (
				<TableRow hover key={JSON.stringify(reminder)}>
					<TableCell
						align="center"
						className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.get('status', UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell
						className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['appointment', 'provider', 'target'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell
						className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['appointment', 'date'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell
						className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['appointment', 'time'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell
						align="center"
						className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['appointment', 'duration'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell
						className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['patient', 'name'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell
						className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['patient', 'accountNumber'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell
						className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['patient', 'dateOfBirth'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell
						className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['patient', 'preferredContactMethod'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getPatientPhoneNumberByType('Work') || UNKNOWN}
						</Typography>
					</TableCell>
					<TableCell className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getPatientPhoneNumberByType('Home') || UNKNOWN}
						</Typography>
					</TableCell>
					<TableCell className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getPatientPhoneNumberByType('Cell') || UNKNOWN}
						</Typography>
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	);
}

ReportTableBody.propTypes = {
	reminders: PropTypes.arrayOf(PropTypes.instanceOf(Reminder)).isRequired
};

export default ReportTableBody;
