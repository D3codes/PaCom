import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	IconButton, makeStyles, Menu, MenuItem, TableCell, TableRow, Typography
} from '@material-ui/core';
import {
	DeleteForever, Edit, MoreVert, Warning
} from '@material-ui/icons';

import Procedure from '../../models/procedure';
import dialogController from '../../utilities/dialogController';

import { ProcedureMappingConfirmDeleteTitle, ProcedureMappingConfirmDeleteMessage } from '../../localization/en/dialogText';

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

function ProcedureMappingsTableRow({
	hasWritePermission = false, onEdit, onRemove, procedure
}) {
	const classes = useStyles();
	const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(false);

	function handleEditClick() {
		setMoreMenuAnchorEl(null);
		onEdit(procedure);
	}

	function handleRemoveClick() {
		dialogController.confirmDelete(ProcedureMappingConfirmDeleteTitle, `${ProcedureMappingConfirmDeleteMessage}${procedure.source}?`).then(({ response }) => {
			if (response === 0) {
				setMoreMenuAnchorEl(null);
				onRemove(procedure);
			}
		});
	}

	function handleMoreClick(event) {
		setMoreMenuAnchorEl(event.currentTarget);
	}

	function handleMoreMenuClose() {
		setMoreMenuAnchorEl(null);
	}

	const isUnmappedProcedure = !procedure.get('target') || !procedure.get('phonetic');

	return (
		<TableRow hover key={procedure.source}>
			<TableCell className={classes.tableCell}>
				<Typography variant="body2" className={clsx({ [classes.unmappedSource]: isUnmappedProcedure })}>
					{isUnmappedProcedure && (
						<Warning className={classes.warningIcon} />
					)}
					{procedure.get('source')}
				</Typography>
			</TableCell>
			<TableCell className={classes.tableCell}><Typography variant="body2">{procedure.get('target', '-')}</Typography></TableCell>
			<TableCell className={classes.tableCell}><Typography variant="body2">{procedure.get('phonetic', '-')}</Typography></TableCell>
			<TableCell className={classes.tableCell}><Typography variant="body2">{procedure.get('smsReminder', 'Default')}</Typography></TableCell>
			<TableCell className={classes.tableCell}><Typography variant="body2">{procedure.get('phoneReminder', 'Default')}</Typography></TableCell>
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
						<Typography className={classes.moreMenuText} color="error">Delete</Typography>
					</MenuItem>
				</Menu>
			</TableCell>
		</TableRow>
	);
}

ProcedureMappingsTableRow.propTypes = {
	hasWritePermission: PropTypes.bool,
	onEdit: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	procedure: PropTypes.instanceOf(Procedure).isRequired
};

export default ProcedureMappingsTableRow;
