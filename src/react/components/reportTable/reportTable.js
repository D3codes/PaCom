import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	makeStyles, Table, Typography
} from '@material-ui/core';

import Reminder from '../../models/reminder';

import ReportActions from './reportActions';
import ReportTableBody from './reportTableBody';
import ReportTableHeader from './reportTableHeader';

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
	tableContainer: {
		flexFlow: 'column',
		flex: 1,
		margin: theme.spacing(2, 0),
		overflowY: 'auto'
	}
}));

function ReportTable({ reminders = null }) {
	const classes = useStyles();

	return (
		<Fragment>
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
				<div className={classes.tableContainer}>
					<Table padding="none" stickyHeader>
						<ReportTableHeader />
						<ReportTableBody reminders={reminders} />
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
