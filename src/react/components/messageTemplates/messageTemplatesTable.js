import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
	makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';

import Template from '../../models/template';
import Procedure from '../../models/procedure';
import MessageTemplatesTableRow from './messageTemplatesTableRow';

const useStyles = makeStyles(theme => ({
	firstTableHeadCell: {
		borderTopLeftRadius: 4
	},
	lastTableHeadCell: {
		borderTopRightRadius: 4
	},
	noMessageTemplatesText: {
		borderBottom: 'none',
		fontStyle: 'italic',
		color: theme.palette.text.secondary
	},
	providerTable: {
		flex: 1,
		overflowY: 'auto'
	},
	tableCell: {
		padding: theme.spacing()
	},
	tableHeadCell: {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.primary.contrastText
	}
}));

function MessageTemplatesTable({
	hasWritePermission = false, onEdit, onRemove, templates = null, defaultPhoneTemplate = null, defaultSmsTemplate = null, procedureMappings = []
}) {
	const classes = useStyles();

	return (
		<div className={classes.providerTable}>
			<Table padding="none" stickyHeader>
				<colgroup>
					<col style={{ width: '25%' }} />
					<col style={{ width: '65%' }} />
					<col style={{ width: '10%' }} />
				</colgroup>
				<TableHead>
					<TableRow>
						<TableCell className={clsx(classes.firstTableHeadCell, classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Name
							</Typography>
						</TableCell>
						<TableCell className={clsx(classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Body
							</Typography>
						</TableCell>
						<TableCell align="center" className={clsx(classes.lastTableHeadCell, classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Actions
							</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{!templates?.length && (
						<TableRow>
							<TableCell
								className={classes.noMessageTemplatesText}
								align="center"
								colSpan={3}>
								No Message Templates Configured
							</TableCell>
						</TableRow>
					)}
					{templates?.map(template => (
						<MessageTemplatesTableRow
							hasWritePermission={hasWritePermission}
							key={template.name}
							onEdit={onEdit}
							onRemove={onRemove}
							template={template}
							isReminder={
								template.get('name') === defaultPhoneTemplate
								|| template.get('name') === defaultSmsTemplate
								|| !!(procedureMappings.find(m => m.phoneReminder === template.get('name') || m.smsReminder === template.get('name')))
							}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

MessageTemplatesTable.propTypes = {
	hasWritePermission: PropTypes.bool,
	onEdit: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	templates: PropTypes.arrayOf(PropTypes.instanceOf(Template)),
	defaultPhoneTemplate: PropTypes.string,
	defaultSmsTemplate: PropTypes.string,
	procedureMappings: PropTypes.arrayOf(PropTypes.instanceOf(Procedure))
};

export default MessageTemplatesTable;
