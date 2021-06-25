import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
	makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';

import Provider from '../../models/provider';
import DynamicValue from '../../models/dynamicValue';
import DynamicValuesTableRow from './dynamicValuesTableRow';

const useStyles = makeStyles(theme => ({
	firstTableHeadCell: {
		borderTopLeftRadius: 4
	},
	lastTableHeadCell: {
		borderTopRightRadius: 4
	},
	noDynamicValuesText: {
		borderBottom: 'none',
		fontStyle: 'italic',
		color: theme.palette.text.secondary
	},
	dynamicValueTable: {
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

function DynamicValuesTable({
	hasWritePermission = false, onEdit, onRemove, providers = null, dynamicValues = null
}) {
	const classes = useStyles();

	return (
		<div className={classes.dynamicValueTable}>
			<Table padding="none" stickyHeader>
				<colgroup>
					<col style={{ width: '90%' }} />
					<col style={{ width: '10%' }} />
				</colgroup>
				<TableHead>
					<TableRow>
						<TableCell className={clsx(classes.firstTableHeadCell, classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Name
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
					{!dynamicValues?.length && (
						<TableRow>
							<TableCell
								className={classes.noDynamicValuesText}
								align="center"
								colSpan={2}>
								No Dynamic Values Configured
							</TableCell>
						</TableRow>
					)}
					{dynamicValues?.map(value => (
						<DynamicValuesTableRow
							hasWritePermission={hasWritePermission}
							key={value.name}
							onEdit={onEdit}
							onRemove={onRemove}
							value={value}
							incomplete={!providers?.every(provider => value.mappings.find(mapping => mapping.providerSource === provider.source))}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

DynamicValuesTable.propTypes = {
	hasWritePermission: PropTypes.bool,
	onEdit: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider)),
	dynamicValues: PropTypes.arrayOf(PropTypes.instanceOf(DynamicValue))
};

export default DynamicValuesTable;
