import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	makeStyles, Table, TableBody, Typography, Button
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import Reminder from '../../models/reminder';
import ProviderDateTableRows from './providerDateTableRows';
import ReportActions from './reportActions';
import ReportTableHeader from './reportTableHeader';
import reportExporter from '../../utilities/reportExporter';
import groupReminders from '../../utilities/reminderGrouper';

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
	},
	topBar: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	backButton: {
		marginRight: theme.spacing(3)
	}
}));

function ReportTable({
	onSend, disableNavigation = false, reminders = null, sendDisabled = false, onBack, filePath
}) {
	const classes = useStyles();
	const remindersByProviderAndDate = reminders ? groupReminders.byProviderAndDate(reminders) : null;
	const completedReminders = reminders?.filter(reminder => reminder.status !== 'Pending' && reminder.status !== 'Sending');
	const progress = completedReminders && reminders
		? (completedReminders.length / reminders.length) * 100
		: null;

	const handleExport = () => {
		reportExporter.exportReport(remindersByProviderAndDate);
	};

	return (
		<Fragment>
			<div className={classes.topBar}>
				<Button
					onClick={() => onBack()}
					className={classes.backButton}
					color="primary"
					startIcon={<ArrowBackIos />}
					disabled={disableNavigation}>
					Back
				</Button>
				<Typography
					color="textSecondary"
					variant="subtitle1">
					{filePath}
				</Typography>
			</div>
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
			<ReportActions onSend={onSend} onExport={handleExport} sendDisabled={sendDisabled} progress={progress || 0} isSending={disableNavigation} />
		</Fragment>
	);
}

ReportTable.propTypes = {
	onSend: PropTypes.func.isRequired,
	reminders: PropTypes.arrayOf(PropTypes.instanceOf(Reminder)),
	sendDisabled: PropTypes.bool,
	disableNavigation: PropTypes.bool,
	onBack: PropTypes.func.isRequired,
	filePath: PropTypes.string.isRequired
};

export default ReportTable;
