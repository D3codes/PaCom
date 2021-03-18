import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	IconButton, makeStyles, Menu, MenuItem, TableCell, TableRow, Typography
} from '@material-ui/core';
import {
	DeleteForever, Edit, MoreVert, Warning
} from '@material-ui/icons';

import Provider from '../../models/provider';
import messageController from '../../utilities/messageController';

import {
	ProviderMappingConfirmDeleteTitle, ProviderMappingConfirmDeleteMessage
} from '../../localization/en/dialogText';

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
	unmappedSource: {
		display: 'inline-flex',
		alignItems: 'center'
	},
	warningIcon: {
		color: theme.palette.warning.main,
		paddingRight: theme.spacing(),
		verticalAlign: 'bottom'
	}
}));

function ProviderMappingsTableRow({
	hasWritePermission = false, onEdit, onRemove, provider
}) {
	const classes = useStyles();
	const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(false);

	function handleEditClick() {
		setMoreMenuAnchorEl(null);
		onEdit(provider);
	}

	function handleRemoveClick() {
		messageController.confirmDelete(ProviderMappingConfirmDeleteTitle, `${ProviderMappingConfirmDeleteMessage}${provider.source}?`).then(({ response }) => {
			if (response === 0) {
				setMoreMenuAnchorEl(null);
				onRemove(provider);
			}
		});
	}

	function handleMoreClick(event) {
		setMoreMenuAnchorEl(event.currentTarget);
	}

	function handleMoreMenuClose() {
		setMoreMenuAnchorEl(null);
	}

	const isUnmappedProvider = !provider.get('target') && !provider.get('phonetic');

	return (
		<TableRow hover key={provider.source}>
			<TableCell className={classes.tableCell}>
				<Typography variant="body2" className={isUnmappedProvider && classes.unmappedSource}>
					{isUnmappedProvider && (
						<Warning className={classes.warningIcon} />
					)}
					{provider.get('source')}
				</Typography>
			</TableCell>
			<TableCell className={classes.tableCell}><Typography variant="body2">{provider.get('target', '-')}</Typography></TableCell>
			<TableCell className={classes.tableCell}><Typography variant="body2">{provider.get('phonetic', '-')}</Typography></TableCell>
			<TableCell align="center" className={classes.tableCell}>
				<IconButton disabled={!hasWritePermission} onClick={handleMoreClick}>
					<MoreVert />
				</IconButton>
				<Menu anchorEl={moreMenuAnchorEl} open={Boolean(moreMenuAnchorEl)} onClose={handleMoreMenuClose}>
					<MenuItem className={classes.moreMenuItem} onClick={handleEditClick}>
						<Edit color="primary" />
						<Typography className={classes.moreMenuText} color="primary">Edit</Typography>
					</MenuItem>
					<MenuItem className={classes.moreMenuItem} onClick={handleRemoveClick}>
						<DeleteForever color="error" />
						<Typography className={classes.moreMenuText} color="error">Remove</Typography>
					</MenuItem>
				</Menu>
			</TableCell>
		</TableRow>
	);
}

ProviderMappingsTableRow.propTypes = {
	hasWritePermission: PropTypes.bool,
	onEdit: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	provider: PropTypes.instanceOf(Provider).isRequired
};

export default ProviderMappingsTableRow;
