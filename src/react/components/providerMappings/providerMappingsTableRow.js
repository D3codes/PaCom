import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	IconButton, makeStyles, Menu, MenuItem, TableCell, TableRow, Typography
} from '@material-ui/core';
import {
	DeleteForever, Edit, MoreVert, Warning
} from '@material-ui/icons';

import Provider from '../../models/provider';

const useStyles = makeStyles(theme => ({
	moreMenuItem: {
		color: theme.palette.text.secondary
	},
	moreMenuText: {
		paddingLeft: theme.spacing()
	},
	tableCell: {
		padding: theme.spacing()
	},
	warningIcon: {
		color: theme.palette.warning.main,
		paddingRight: theme.spacing(),
		verticalAlign: 'bottom'
	}
}));

function ProviderMappingsTableRow({ provider }) {
	const classes = useStyles();
	const [moreMenuAnchorEl, setMoreMenuAchorEl] = useState(false);

	function handleEditClick() {
		setMoreMenuAchorEl(null);
		// TODO: Edit logic
	}

	function handleRemoveClick() {
		setMoreMenuAchorEl(null);
		// TODO: Remove logic
	}

	function handleMoreClick(event) {
		setMoreMenuAchorEl(event.currentTarget);
	}

	function handleMoreMenuClose() {
		setMoreMenuAchorEl(null);
	}

	return (
		<TableRow key={provider.source}>
			<TableCell className={classes.tableCell}>
				<Typography variant="body2">
					{!provider.get('target') && !provider.get('phonetic') && (
						<Warning className={classes.warningIcon} />
					)}
					{provider.get('source')}
				</Typography>
			</TableCell>
			<TableCell className={classes.tableCell}><Typography variant="body2">{provider.get('target', '-')}</Typography></TableCell>
			<TableCell className={classes.tableCell}><Typography variant="body2">{provider.get('phonetic', '-')}</Typography></TableCell>
			<TableCell align="center" className={classes.tableCell}>
				<IconButton onClick={handleMoreClick}>
					<MoreVert />
				</IconButton>
				<Menu anchorEl={moreMenuAnchorEl} open={Boolean(moreMenuAnchorEl)} onClose={handleMoreMenuClose}>
					<MenuItem className={classes.moreMenuItem} onClick={handleEditClick}>
						<Edit color="inherit" />
						<Typography className={classes.moreMenuText} color="inherit">Edit</Typography>
					</MenuItem>
					<MenuItem className={classes.moreMenuItem} onClick={handleRemoveClick}>
						<DeleteForever color="inherit" />
						<Typography className={classes.moreMenuText} color="inherit">Remove</Typography>
					</MenuItem>
				</Menu>
			</TableCell>
		</TableRow>
	);
}

ProviderMappingsTableRow.propTypes = {
	provider: PropTypes.instanceOf(Provider).isRequired
};

export default ProviderMappingsTableRow;
