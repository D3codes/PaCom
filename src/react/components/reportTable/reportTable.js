import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	makeStyles, Table, TableBody, Typography
} from '@material-ui/core';
import Reminder from '../../models/reminder';
import ProviderDateTableRows from './providerDateTableRows';
import ReportActions from './reportActions';
import ReportTableHeader from './reportTableHeader';
import reportExporter from '../../utilities/reportExporter';

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

function ReportTable({ onSend, reminders = null, sendDisabled = false }) {
	const classes = useStyles();
	const remindersByProviderAndDate = reminders ? groupRemindersByProviderAndDate(reminders) : null;
	const completedReminders = reminders?.filter(reminder => reminder.status !== 'Pending' && reminder.status !== 'Sending');
	const progress = (completedReminders?.length / reminders?.length) * 100;

	const handleExport = () => {
		reportExporter.exportReport(remindersByProviderAndDate);
	};

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
						<colgroup>
							<col style={{ width: '11%' }} />
							<col style={{ width: '10%' }} />
							<col style={{ width: '9%' }} />
							<col style={{ width: '18%' }} />
							<col style={{ width: '10%' }} />
							<col style={{ width: '8%' }} />
							<col style={{ width: '10%' }} />
							<col style={{ width: '12%' }} />
							<col style={{ width: '12%' }} />
						</colgroup>
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
			<ReportActions onSend={onSend} onExport={handleExport} sendDisabled={sendDisabled} progress={progress} />
		</Fragment>
	);
}

ReportTable.propTypes = {
	onSend: PropTypes.func.isRequired,
	reminders: PropTypes.arrayOf(PropTypes.instanceOf(Reminder)),
	sendDisabled: PropTypes.bool
};

export default ReportTable;
