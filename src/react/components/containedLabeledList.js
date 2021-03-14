import React from 'react';
import PropTypes from 'prop-types';
import {
	Typography, Card, List, ListItem, ListItemText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	containedLabeledListContainer: {
		height: '100%'
	},
	card: {
		overflowY: 'hidden',
		height: '100%'
	},
	list: {
		width: '100%',
		overflowY: 'auto',
		height: '100%'
	}
}));

function ContainedLabeledList({ onClick, label = '', items = null }) {
	const classes = useStyles();

	return (
		<div className={classes.containedLabeledListContainer}>
			<Typography color="primary" variant="h5" display="inline">{label}</Typography>
			<Card className={classes.card}>
				<List className={classes.list}>
					{items && items.map(item => (
						<ListItem
							key={JSON.stringify(item)}
							divider
							button
							onClick={() => onClick(item)}>
							<ListItemText primary={item.name} />
						</ListItem>
					))}
				</List>
			</Card>
		</div>
	);
}

ContainedLabeledList.propTypes = {
	onClick: PropTypes.func.isRequired,
	label: PropTypes.string,
	items: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.string }))
};

export default ContainedLabeledList;
