import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
	makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';

import Provider from '../../models/provider';
import DynamicValueMappingsTableRow from './dynamicValueMappingsTableRow';

const useStyles = makeStyles(theme => ({
	firstTableHeadCell: {
		borderTopLeftRadius: 4
	},
	lastTableHeadCell: {
		borderTopRightRadius: 4
	},
	noProvidersText: {
		borderBottom: 'none',
		fontStyle: 'italic',
		color: theme.palette.text.secondary
	},
	dynamicValueTable: {
		flex: 1,
		overflowY: 'auto',
		height: '500px'
	},
	tableCell: {
		padding: theme.spacing()
	},
	tableHeadCell: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText
	}
}));

function DynamicValueMappingsTable({
	onEdit, mappings, providers = null
}) {
	const classes = useStyles();

	return (
		<div className={classes.dynamicValueTable}>
			<Table padding="none" stickyHeader>
				<colgroup>
					<col style={{ width: '20%' }} />
					<col style={{ width: '70%' }} />
					<col style={{ width: '10%' }} />
				</colgroup>
				<TableHead>
					<TableRow>
						<TableCell className={clsx(classes.firstTableHeadCell, classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Provider
							</Typography>
						</TableCell>
						<TableCell className={clsx(classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Value
							</Typography>
						</TableCell>
						<TableCell align="center" className={clsx(classes.lastTableHeadCell, classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Edit
							</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{!providers?.length && (
						<TableRow>
							<TableCell
								className={classes.noProvidersText}
								align="center"
								colSpan={3}>
								No Provider Mappings Configured
							</TableCell>
						</TableRow>
					)}
					{providers?.map(provider => (
						<DynamicValueMappingsTableRow
							key={provider.source}
							onEdit={onEdit}
							providerSource={provider.source}
							providerTarget={provider.target}
							value={mappings.find(mapping => mapping.providerSource === provider.source)?.value || ''}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

DynamicValueMappingsTable.propTypes = {
	onEdit: PropTypes.func.isRequired,
	mappings: PropTypes.arrayOf(PropTypes.object).isRequired,
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider))
};

export default DynamicValueMappingsTable;
