import React from 'react';
import PropTypes from 'prop-types';
import {
	Divider, List, ListItem, ListItemIcon, ListItemText, makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	title: {
		paddingBottom: theme.spacing(),
		color: theme.palette.text.darkContrast
	},
	listContent: {
		color: 'inherit'
	},
	listItem: {
		'&$selected': {
			color: theme.palette.primary.light,
			backgroundColor: 'initial',
			'&:hover': {
				backgroundColor: 'rgba(255, 255, 255, 0.04)'
			}
		},
		'&:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.04)'
		},
		color: theme.palette.text.darkContrast
	},
	selected: {}
}));

function CategorySection({
	inset = false, items, onItemSelect, selectedItemId = null, title
}) {
	const classes = useStyles();
	return (
		<List disablePadding>
			<Divider />
			<ListItem className={classes.title}>
				<ListItemText>
					{title}
				</ListItemText>
			</ListItem>
			{items.map(({ Icon, id, label }) => (
				<ListItem
					button
					classes={{ selected: classes.selected }}
					className={classes.listItem}
					key={id}
					onClick={() => onItemSelect(id)}
					selected={id === selectedItemId}>
					{Icon && (
						<ListItemIcon className={classes.listContent}>
							<Icon />
						</ListItemIcon>
					)}
					<ListItemText classes={{ primary: classes.listContent }} inset={inset}>{label}</ListItemText>
				</ListItem>
			))}
		</List>
	);
}

CategorySection.propTypes = {
	inset: PropTypes.bool,
	items: PropTypes.arrayOf(PropTypes.shape({
		Icon: PropTypes.node,
		id: PropTypes.string,
		label: PropTypes.string
	})).isRequired,
	onItemSelect: PropTypes.func.isRequired,
	selectedItemId: PropTypes.string,
	title: PropTypes.string.isRequired
};

export default CategorySection;
