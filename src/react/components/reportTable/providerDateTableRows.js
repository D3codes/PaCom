import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	makeStyles, TableCell, TableRow, Typography, Tooltip
} from '@material-ui/core';
import {
	Done, Error, Loop, Redo
} from '@material-ui/icons';

import ContactMethod from '../../models/conactMethod';
import Reminder from '../../models/reminder';

const NA = '-';

const StatusIcons = classes => ({
	// eslint-disable-next-line react/destructuring-assignment
	[Reminder.Status.Sending]: <Loop color="inherit" className={classes.statusIcon} />,
	// eslint-disable-next-line react/destructuring-assignment
	[Reminder.Status.Sent]: <Done color="inherit" className={classes.statusIcon} />,
	// eslint-disable-next-line react/destructuring-assignment
	[Reminder.Status.Failed]: <Error color="inherit" className={classes.statusIcon} />,
	// eslint-disable-next-line react/destructuring-assignment
	[Reminder.Status.Skipped]: <Redo color="inherit" className={classes.statusIcon} />
});

const getStatusCellClassName = (classes, status) => {
	let className = '';
	switch (status) {
	case Reminder.Status.Sending:
		className = classes.sending;
		break;
	case Reminder.Status.Sent:
		className = classes.sent;
		break;
	case Reminder.Status.Failed:
		className = classes.fail;
		break;
	default:
		className = classes.pending;
	}
	return clsx(className, classes.statusContainer);
};

const useStyles = makeStyles(theme => ({
	cancel: {
		color: theme.palette.warning.main
	},
	fail: {
		color: theme.palette.error.main
	},
	pending: {
		color: theme.palette.text.secondary
	},
	providerDateCell: {
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.grey.A400,
		position: 'sticky',
		top: 41
	},
	providerDateText: {
		padding: theme.spacing(0.5, 1)
	},
	sending: {
		color: theme.palette.info.main
	},
	sent: {
		color: theme.palette.success.main
	},
	statusCell: {
		display: 'flex',
		alignItems: 'center'
	},
	statusContainer: {
		paddingLeft: theme.spacing()
	},
	statusIcon: {
		margin: theme.spacing(0, 0.5),
		fontSize: '1.25rem'
	},
	boldText: {
		fontWeight: theme.typography.fontWeightBold
	},
	tableCell: {
		padding: theme.spacing(1, 0)
	}
}));

function ProviderDateTableRows({ providerDateText, reminders }) {
	const classes = useStyles();
	return (
		<Fragment>
			<TableRow>
				<TableCell className={classes.providerDateCell} colSpan={10}>
					<Typography className={clsx(classes.providerDateText, classes.boldText)} color="inherit">{providerDateText}</Typography>
				</TableCell>
			</TableRow>
			{reminders.map(reminder => (
				<Tooltip title={reminder.get('statusMessage') || ''} key={JSON.stringify(reminder)}>
					<TableRow hover>
						<TableCell className={classes.tableCell}>
							<div className={clsx(getStatusCellClassName(classes, reminder.get('status')), classes.statusCell)}>
								{StatusIcons(classes)[reminder.get('status', NA)]}
								<Typography color="inherit" className={classes.boldText} variant="body2">
									{reminder.get('status', NA)}
								</Typography>
							</div>
						</TableCell>
						<TableCell className={classes.tableCell}>
							<Typography variant="body2">
								{reminder.getIn(['appointment', 'time'], NA)}
							</Typography>
						</TableCell>
						<TableCell className={classes.tableCell}>
							<Typography variant="body2">
								{reminder.getIn(['appointment', 'duration'], NA)}
							</Typography>
						</TableCell>
						<TableCell className={classes.tableCell}>
							<Typography variant="body2">
								{reminder.getIn(['appointment', 'procedure', 'source'], NA)}
							</Typography>
						</TableCell>
						<TableCell className={classes.tableCell}>
							<Typography variant="body2">
								{reminder.getIn(['patient', 'name'], NA)}
							</Typography>
						</TableCell>
						<TableCell className={classes.tableCell}>
							<Typography variant="body2">
								{reminder.getIn(['patient', 'accountNumber'], NA)}
							</Typography>
						</TableCell>
						<TableCell className={classes.tableCell}>
							<Typography variant="body2">
								{reminder.getIn(['patient', 'preferredContactMethod'], NA)}
							</Typography>
						</TableCell>
						<TableCell className={classes.tableCell}>
							<Typography variant="body2">
								{(reminder.patient && reminder.patient.getPhoneNumberByType(ContactMethod.Types.Home)) || NA}
							</Typography>
						</TableCell>
						<TableCell className={classes.tableCell}>
							<Typography variant="body2">
								{(reminder.patient && reminder.patient.getPhoneNumberByType(ContactMethod.Types.Cell)) || NA}
							</Typography>
						</TableCell>
					</TableRow>
				</Tooltip>
			))}
		</Fragment>
	);
}

ProviderDateTableRows.propTypes = {
	providerDateText: PropTypes.string.isRequired,
	reminders: PropTypes.arrayOf(PropTypes.instanceOf(Reminder))
};

export default ProviderDateTableRows;
