import React from 'react';
import PropTypes from 'prop-types';
import {
	IconButton, makeStyles, TableCell, TableRow, Typography
} from '@material-ui/core';
import { Edit, Warning } from '@material-ui/icons';

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

function DynamicValueMappingsTableRow({
	onEdit, providerSource, providerTarget, value
}) {
	const classes = useStyles();

	function handleEditClick() {
		onEdit(providerSource, value);
	}

	return (
		<TableRow hover>
			<TableCell className={classes.tableCell}>
				<Typography variant="body2">
					{!value && (
						<Warning className={classes.warningIcon} />
					)}
					{providerTarget}
				</Typography>
			</TableCell>
			<TableCell className={classes.tableCell}>
				<Typography variant="body2">
					{value}
				</Typography>
			</TableCell>
			<TableCell align="center" className={classes.tableCell}>
				<IconButton onClick={handleEditClick}>
					<Edit />
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

DynamicValueMappingsTableRow.propTypes = {
	onEdit: PropTypes.func.isRequired,
	providerSource: PropTypes.string.isRequired,
	providerTarget: PropTypes.string.isRequired,
	value: PropTypes.string
};

export default DynamicValueMappingsTableRow;
