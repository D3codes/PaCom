import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
	makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';

import Provider from '../../models/provider';
import ProviderMappingsTableRow from './providerMappingsTableRow';

const useStyles = makeStyles(theme => ({
	firstTableHeadCell: {
		borderTopLeftRadius: 4
	},
	lastTableHeadCell: {
		borderTopRightRadius: 4
	},
	noProviderMappingsText: {
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
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText
	}
}));

function ProviderMappingsTable({
	hasWritePermission = false, onEdit, onRemove, providers = null
}) {
	const classes = useStyles();

	return (
		<div className={classes.providerTable}>
			<Table padding="none" stickyHeader>
				<TableHead>
					<TableRow>
						<TableCell className={clsx(classes.firstTableHeadCell, classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Convert From (Source)
							</Typography>
						</TableCell>
						<TableCell className={clsx(classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Convert To (SMS)
							</Typography>
						</TableCell>
						<TableCell className={clsx(classes.tableHeadCell, classes.tableCell)}>
							<Typography color="inherit">
									Convert To (Phonetic)
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
					{!providers?.length && (
						<TableRow>
							<TableCell
								className={classes.noProviderMappingsText}
								align="center"
								colSpan={4}>
								No Provider Mappings Found
							</TableCell>
						</TableRow>
					)}
					{providers?.map(provider => (
						<ProviderMappingsTableRow
							hasWritePermission={hasWritePermission}
							key={provider.source}
							onEdit={onEdit}
							onRemove={onRemove}
							provider={provider}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

ProviderMappingsTable.propTypes = {
	hasWritePermission: PropTypes.bool,
	onEdit: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider))
};

export default ProviderMappingsTable;
