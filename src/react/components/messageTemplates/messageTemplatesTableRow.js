import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	IconButton, makeStyles, Menu, MenuItem, TableCell, TableRow, Typography, Tooltip
} from '@material-ui/core';
import {
	DeleteForever, Edit, MoreVert
} from '@material-ui/icons';

import Template from '../../models/template';
import dialogController from '../../utilities/dialogController';

import {
	MessageTemplateConfirmDeleteTitle, MessageTemplateConfirmDeleteMessage
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
	}
}));

function MessageTemplatesTableRow({
	hasWritePermission = false, onEdit, onRemove, template, isReminder = false
}) {
	const classes = useStyles();
	const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(false);

	function handleEditClick() {
		setMoreMenuAnchorEl(null);
		onEdit(template);
	}

	function handleRemoveClick() {
		dialogController.confirmDelete(MessageTemplateConfirmDeleteTitle, `${MessageTemplateConfirmDeleteMessage}${template.name}?`).then(({ response }) => {
			if (response === 0) {
				setMoreMenuAnchorEl(null);
				onRemove(template);
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
					{template.get('name')}
				</Typography>
			</TableCell>
			<TableCell className={classes.tableCell}><Typography variant="body2">{template.get('body', '-')}</Typography></TableCell>
			<TableCell align="center" className={classes.tableCell}>
				<IconButton disabled={!hasWritePermission} onClick={handleMoreClick}>
					<MoreVert />
				</IconButton>
				<Menu anchorEl={moreMenuAnchorEl} open={Boolean(moreMenuAnchorEl)} onClose={handleMoreMenuClose}>
					<MenuItem className={classes.moreMenuItem} onClick={handleEditClick}>
						<Edit color="primary" />
						<Typography className={classes.moreMenuText} color="primary">Edit</Typography>
					</MenuItem>
					<Tooltip title={isReminder ? 'Appointment Reminder Templates Cannot Be Deleted' : ''}>
						<div>
							<MenuItem className={classes.moreMenuItem} onClick={handleRemoveClick} disabled={isReminder}>
								<DeleteForever color="error" />
								<Typography className={classes.moreMenuText} color="error">Delete</Typography>
							</MenuItem>
						</div>
					</Tooltip>
				</Menu>
			</TableCell>
		</TableRow>
	);
}

MessageTemplatesTableRow.propTypes = {
	hasWritePermission: PropTypes.bool,
	onEdit: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	template: PropTypes.instanceOf(Template).isRequired,
	isReminder: PropTypes.bool
};

export default MessageTemplatesTableRow;
