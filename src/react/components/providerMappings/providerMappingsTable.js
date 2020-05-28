import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
	IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography
} from '@material-ui/core';
import Save from '@material-ui/icons/Save';

import Provider from '../../models/provider';
import ProviderMappingsTableRow from './providerMappingsTableRow';

const useStyles = makeStyles(theme => ({
	firstTableHeadCell: {
		borderTopLeftRadius: 4
	},
	lastTableHeadCell: {
		borderTopRightRadius: 4
	},
	providerTable: {
		flex: 1
	},
	tableCell: {
		padding: theme.spacing()
	},
	tableHeadCell: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white
	}
}));

function ProviderMappingsTable({ isAddShown = false, providers = null }) {
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
					{providers && providers.map(provider => (
						<ProviderMappingsTableRow key={provider.source} provider={provider} />
					))}
					{isAddShown && (
						<TableRow>
							<TableCell className={classes.tableCell}>
								<TextField
									fullWidth
									label="Source"
									margin="dense"
									placeholder="Source..."
								/>
							</TableCell>
							<TableCell className={classes.tableCell}>
								<TextField
									fullWidth
									label="SMS"
									margin="dense"
									placeholder="SMS..."
								/>
							</TableCell>
							<TableCell className={classes.tableCell}>
								<TextField
									fullWidth
									label="Phonetic"
									margin="dense"
									placeholder="Phonetic..."
								/>
							</TableCell>
							<TableCell align="center" className={classes.tableCell}>
								<IconButton color="primary">
									<Save />
								</IconButton>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

ProviderMappingsTable.propTypes = {
	isAddShown: PropTypes.bool,
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider))
};

export default ProviderMappingsTable;
