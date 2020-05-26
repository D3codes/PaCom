import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	makeStyles, Table, TableBody, Typography
} from '@material-ui/core';
import Reminder from '../../models/reminder';
import ProviderDateTableRows from './providerDateTableRows';
import ReportActions from './reportActions';
import ReportTableHeader from './reportTableHeader';

const groupRemindersByProviderAndDate = reminders => reminders.reduce((remindersByProviderAndDate, reminder) => {
	const providerDateKey = `${reminder.getIn(['appointment', 'provider', 'target'], 'Unmapped Provider(s)')} - ${reminder.getIn(['appointment', 'date'])}`;
	const updatedRemindersByProviderAndDate = { ...remindersByProviderAndDate };
	if (updatedRemindersByProviderAndDate[providerDateKey]) {
		updatedRemindersByProviderAndDate[providerDateKey].push(reminder);
	} else {
		updatedRemindersByProviderAndDate[providerDateKey] = [reminder];
	}
	return updatedRemindersByProviderAndDate;
}, {});

const useStyles = makeStyles(theme => ({
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
	tableContainer: {
		flexFlow: 'column',
		flex: 1,
		margin: theme.spacing(2, 0),
		overflowY: 'auto'
	}
}));

function ReportTable({ reminders = null }) {
	const classes = useStyles();
	const remindersByProviderAndDate = reminders ? groupRemindersByProviderAndDate(reminders) : null;
	return (
		<Fragment>
			{!remindersByProviderAndDate && (
				<div className={classes.noRemindersContainer}>
					<Typography
						align="center"
						className={classes.noRemindersText}
						color="textSecondary"
						variant="subtitle1">
						Please import appointments to view message report
					</Typography>
				</div>
			)}
			{remindersByProviderAndDate && (
				<div className={classes.tableContainer}>
					<Table padding="none" stickyHeader>
						<ReportTableHeader />
						<TableBody>
							{Object.entries(remindersByProviderAndDate).map(([providerDateText, remindersForProviderDate]) => (
								<ProviderDateTableRows
									key={providerDateText}
									providerDateText={providerDateText}
									reminders={remindersForProviderDate}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			)}
			<ReportActions />
		</Fragment>
	);
}

ReportTable.propTypes = {
	reminders: PropTypes.arrayOf(PropTypes.instanceOf(Reminder))
};

export default ReportTable;
