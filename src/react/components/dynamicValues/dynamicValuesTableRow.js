import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	IconButton, makeStyles, Menu, MenuItem, TableCell, TableRow, Typography
} from '@material-ui/core';
import {
	DeleteForever, Edit, MoreVert, Warning
} from '@material-ui/icons';

import DynamicValue from '../../models/dynamicValue';
import dialogController from '../../utilities/dialogController';

import {
	DynamicValueConfirmDeleteTitle, DynamicValueConfirmDeleteMessage
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
	warningIcon: {
		color: theme.palette.warning.main,
		paddingRight: theme.spacing(),
		verticalAlign: 'bottom'
	}
}));

function DynamicValuesTableRow({
	hasWritePermission = false, onEdit, onRemove, value, incomplete = false
}) {
	const classes = useStyles();
	const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(false);

	function handleEditClick() {
		setMoreMenuAnchorEl(null);
		onEdit(value);
	}

	function handleRemoveClick() {
		dialogController.confirmDelete(DynamicValueConfirmDeleteTitle, `${DynamicValueConfirmDeleteMessage}${value.name}?`).then(({ response }) => {
			if (response === 0) {
				setMoreMenuAnchorEl(null);
				onRemove(value);
			}
		});
	}

	function handleMoreClick(event) {
		setMoreMenuAnchorEl(event.currentTarget);
	}

	function handleMoreMenuClose() {
		setMoreMenuAnchorEl(null);
	}

	return (
		<TableRow hover>
			<TableCell className={classes.tableCell}>
				<Typography variant="body2">
					{incomplete && (
						<Warning className={classes.warningIcon} />
					)}
					{value.get('name')}
				</Typography>
			</TableCell>
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

DynamicValuesTableRow.propTypes = {
	hasWritePermission: PropTypes.bool,
	onEdit: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	value: PropTypes.instanceOf(DynamicValue).isRequired,
	incomplete: PropTypes.bool
};

export default DynamicValuesTableRow;
