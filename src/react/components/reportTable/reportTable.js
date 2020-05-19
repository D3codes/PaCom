import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';

import clsx from 'clsx';
import Reminder from '../../models/reminder';
import ReportActions from './reportActions';

const useStyles = makeStyles((theme) => ({
	noRemindersContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: 4,
		margin: theme.spacing(2, 0)
	},
	noRemindersText: {
		fontStyle: 'italic'
	},
	root: {
		flexFlow: 'column',
		flex: 1,
		margin: theme.spacing(2, 0),
		overflowY: 'auto'
	},
	tableCell: {
		padding: theme.spacing(1, 0)
	},
	firstTableCellHead: {
		borderTopLeftRadius: 4
	},
	lastTableCellHead: {
		borderTopRightRadius: 4
	},
	tableCellHead: {
		padding: theme.spacing(1, 0),
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.common.white
	},
	tableHeaderText: {
		fontWeight: theme.typography.fontWeightBold
	}
}));

const UNKNOWN = 'Unknown';

function ReportTable({ reminders = null }) {
	const classes = useStyles();

	return (
		<Fragment>
			<div className={classes.root}>
				{!reminders && (
					<div className={classes.noRemindersContainer}>
						<Typography
							align="center"
							className={classes.noRemindersText}
							color="textSecondary"
							variant="subtitle1">
							Please import a file to view reminder report
						</Typography>
					</div>
				)}
				{reminders && (
					<Table padding="none" stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell align="center" className={clsx(classes.tableCellHead, classes.firstTableCellHead)}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
											Status
									</Typography>
								</TableCell>
								<TableCell className={classes.tableCellHead}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
											Provider
									</Typography>
								</TableCell>
								<TableCell className={classes.tableCellHead}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
											Date
									</Typography>
								</TableCell>
								<TableCell className={classes.tableCellHead}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
											Time
									</Typography>
								</TableCell>
								<TableCell className={classes.tableCellHead}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
											Duration
									</Typography>
								</TableCell>
								<TableCell className={classes.tableCellHead}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
											Patient
									</Typography>
								</TableCell>
								<TableCell className={classes.tableCellHead}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
											Account
									</Typography>
								</TableCell>
								<TableCell className={classes.tableCellHead}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
											Date of Birth
									</Typography>
								</TableCell>
								<TableCell className={classes.tableCellHead}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Notify By
									</Typography>
								</TableCell>
								<TableCell className={classes.tableCellHead}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Work Phone
									</Typography>
								</TableCell>
								<TableCell className={classes.tableCellHead}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
											Home Phone
									</Typography>
								</TableCell>
								<TableCell className={clsx(classes.tableCellHead, classes.lastTableCellHead)}>
									<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Cell Phone
									</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{reminders.map((reminder) => (
								<TableRow hover key={JSON.stringify(reminder)}>
									<TableCell
										align="center"
										className={classes.tableCell}>
										<Typography variant="body2">
											{reminder.status}
										</Typography>
									</TableCell>
									<TableCell
										className={classes.tableCell}>
										<Typography variant="body2">
											{(reminder.appointment && reminder.appointment.provider && reminder.appointment.provider.target) || UNKNOWN}
										</Typography>
									</TableCell>
									<TableCell
										className={classes.tableCell}>
										<Typography variant="body2">
											{(reminder.appointment && reminder.appointment.date) || UNKNOWN}
										</Typography>
									</TableCell>
									<TableCell
										className={classes.tableCell}>
										<Typography variant="body2">
											{(reminder.appointment && reminder.appointment.time) || UNKNOWN}
										</Typography>
									</TableCell>
									<TableCell
										className={classes.tableCell}>
										<Typography variant="body2">
											{(reminder.appointment && reminder.appointment.duration) || UNKNOWN}
										</Typography>
									</TableCell>
									<TableCell
										className={classes.tableCell}>
										<Typography variant="body2">
											{(reminder.patient && reminder.patient.name) || UNKNOWN}
										</Typography>
									</TableCell>
									<TableCell
										className={classes.tableCell}>
										<Typography variant="body2">
											{(reminder.patient && reminder.patient.accountNumber)}
										</Typography>
									</TableCell>
									<TableCell
										className={classes.tableCell}>
										<Typography variant="body2">
											{(reminder.patient && reminder.patient.dateOfBirth) || UNKNOWN}
										</Typography>
									</TableCell>
									<TableCell
										className={classes.tableCell}>
										<Typography variant="body2">
											{(reminder.patient && reminder.patient.preferredContactMethod) || UNKNOWN}
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
					</Table>
				)}
			</div>
			<ReportActions />
		</Fragment>
	);
}

ReportTable.propTypes = {
	reminders: PropTypes.arrayOf(PropTypes.instanceOf(Reminder))
};

export default ReportTable;
