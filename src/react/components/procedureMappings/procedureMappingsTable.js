import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
	makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';

import Procedure from '../../models/procedure';
import ProcedureMappingsTableRow from './procedureMappingsTableRow';

const useStyles = makeStyles(theme => ({
	firstTableHeadCell: {
		borderTopLeftRadius: 4
	},
	lastTableHeadCell: {
		borderTopRightRadius: 4
	},
	noProcedureMappingsText: {
		borderBottom: 'none',
		fontStyle: 'italic',
		color: theme.palette.text.secondary
	},
	procedureTable: {
		flex: 1,
		overflowY: 'auto'
	},
	tableCell: {
		padding: theme.spacing()
	},
	tableHeadCell: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText
	}
}));

function ProcedureMappingsTable({
	hasWritePermission = false, onEdit, onRemove, procedures = null
}) {
	const classes = useStyles();

	return (
		<div className={classes.procedureTable}>
			<Table padding="none" stickyHeader>
				<colgroup>
					<col style={{ width: '18%' }} />
					<col style={{ width: '18%' }} />
					<col style={{ width: '18%' }} />
					<col style={{ width: '18%' }} />
					<col style={{ width: '18%' }} />
					<col style={{ width: '10%' }} />
				</colgroup>
				<TableHead>
					<TableRow>
						<TableCell className={clsx(classes.firstTableHeadCell, classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Source
							</Typography>
						</TableCell>
						<TableCell className={clsx(classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									SMS Target
							</Typography>
						</TableCell>
						<TableCell className={clsx(classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Phonetic Target
							</Typography>
						</TableCell>
						<TableCell className={clsx(classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									SMS Reminder
							</Typography>
						</TableCell>
						<TableCell className={clsx(classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Call Reminder
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
					{!procedures?.length && (
						<TableRow>
							<TableCell
								className={classes.noProcedureMappingsText}
								align="center"
								colSpan={6}>
								No Procedure Mappings Configured
							</TableCell>
						</TableRow>
					)}
					{procedures?.map(procedure => (
						<ProcedureMappingsTableRow
							hasWritePermission={hasWritePermission}
							key={procedure.source}
							onEdit={onEdit}
							onRemove={onRemove}
							procedure={procedure}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

ProcedureMappingsTable.propTypes = {
	hasWritePermission: PropTypes.bool,
	onEdit: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	procedures: PropTypes.arrayOf(PropTypes.instanceOf(Procedure))
};

export default ProcedureMappingsTable;
