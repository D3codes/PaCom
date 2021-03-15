import React from 'react';
import PropTypes from 'prop-types';
import {
	Typography, Card, List, ListItem, ListItemText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	containedLabeledListContainer: {
		height: '100%'
	},
	card: {
		overflowY: 'hidden',
		height: '100%',
		display: 'flex',
		alignContent: 'center',
		justifyContent: 'center'
	},
	list: {
		width: '100%',
		overflowY: 'auto',
		height: '100%'
	},
	placeholderText: {
		fontStyle: 'italic',
		color: theme.palette.text.secondary,
		alignSelf: 'center'
	}
}));

function ContainedLabeledList({
	onClick, label = '', items = null, disabled = false
}) {
	const classes = useStyles();

	return (
		<div className={classes.containedLabeledListContainer}>
			<Typography color="primary" variant="h5" display="inline">{label}</Typography>
			<Card className={classes.card}>
				{(items?.length > 0) && (
					<List className={classes.list}>
						{items && items.map(item => (
							<ListItem
								disabled={disabled}
								key={JSON.stringify(item)}
								divider
								button
								onClick={() => onClick(item)}>
								<ListItemText primary={item.name} />
							</ListItem>
						))}
					</List>
				)}
				{!items?.length && <Typography className={classes.placeholderText}>{`No ${label} Found`}</Typography>}
			</Card>
		</div>
	);
}

ContainedLabeledList.propTypes = {
	onClick: PropTypes.func.isRequired,
	label: PropTypes.string,
	items: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.string })),
	disabled: PropTypes.bool
};

export default ContainedLabeledList;
