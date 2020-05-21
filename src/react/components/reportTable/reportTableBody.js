import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	CircularProgress, makeStyles, TableBody, TableCell, TableRow, Typography
} from '@material-ui/core';
import { Done, Error, Warning } from '@material-ui/icons';

import Reminder from '../../models/reminder';

const UNKNOWN = 'Unknown';

const StatusIcons = (classes) => ({
	[Reminder.Status.Pending]: <CircularProgress className={classes.statusIcon} color="inherit" size={18} />,
	[Reminder.Status.Sent]: <Done color="inherit" className={classes.statusIcon} />,
	[Reminder.Status.Canceled]: <Warning color="inherit" className={classes.statusIcon} />,
	[Reminder.Status.Failed]: <Error color="inherit" className={classes.statusIcon} />
});

const getStatusCellClassName = (classes, status) => {
	switch (status) {
	case Reminder.Status.Sent:
		return classes.sent;
	case Reminder.Status.Canceled:
		return classes.cancel;
	case Reminder.Status.Failed:
		return classes.fail;
	default:
		return classes.pending;
	}
};

const useStyles = makeStyles((theme) => ({
	cancel: {
		color: theme.palette.warning.main
	},
	fail: {
		color: theme.palette.error.main
	},
	pending: {
		color: theme.palette.info.main
	},
	sent: {
		color: theme.palette.success.main
	},
	statusCell: {
		display: 'flex',
		justifyContant: 'space-between',
		alignContent: 'center'
	},
	statusIcon: {
		margin: theme.spacing(0, 0.5),
		fontSize: '1.25rem'
	},
	statusText: {
		fontWeight: theme.typography.fontWeightBold
	},
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
					<TableCell align="center" className={classes.tableCell}>
						<div className={clsx(getStatusCellClassName(classes, reminder.get('status')), classes.statusCell)}>
							{StatusIcons(classes)[reminder.get('status', UNKNOWN)]}
							<Typography color="inherit" className={classes.statusText} variant="body2">
								{reminder.get('status', UNKNOWN)}
							</Typography>
						</div>
					</TableCell>
					<TableCell className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['appointment', 'provider', 'target'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['appointment', 'date'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['appointment', 'time'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell align="center" className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['appointment', 'duration'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['patient', 'name'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['patient', 'accountNumber'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell className={classes.tableCell}>
						<Typography variant="body2">
							{reminder.getIn(['patient', 'dateOfBirth'], UNKNOWN)}
						</Typography>
					</TableCell>
					<TableCell className={classes.tableCell}>
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
