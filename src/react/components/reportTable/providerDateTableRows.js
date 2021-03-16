import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	CircularProgress, makeStyles, TableCell, TableRow, Typography
} from '@material-ui/core';
import {
	Done, Error, Warning
} from '@material-ui/icons';

import ContactMethod from '../../models/conactMethod';
import Reminder from '../../models/reminder';

const NA = 'N/A';

const StatusIcons = classes => ({
	[Reminder.Status.Sending]: <CircularProgress className={classes.statusIcon} color="inherit" size={18} />,
	[Reminder.Status.Sent]: <Done color="inherit" className={classes.statusIcon} />,
	[Reminder.Status.Canceled]: <Warning color="inherit" className={classes.statusIcon} />,
	[Reminder.Status.Failed]: <Error color="inherit" className={classes.statusIcon} />
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
	case Reminder.Status.Canceled:
		className = classes.cancel;
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
		color: theme.palette.common.white
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
		justifyContent: 'space-between',
		alignContent: 'center'
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
				<TableRow hover key={JSON.stringify(reminder)}>
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
							{reminder.getIn(['patient', 'dateOfBirth'], NA)}
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
			))}
		</Fragment>
	);
}

ProviderDateTableRows.propTypes = {
	providerDateText: PropTypes.string.isRequired,
	reminders: PropTypes.arrayOf(PropTypes.instanceOf(Reminder))
};

export default ProviderDateTableRows;
