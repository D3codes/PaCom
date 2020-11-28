import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	TextField, List, ListItem, ListItemText, Typography
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	listContainer: {
		float: 'left',
		width: '50%'
	},
	list: {
		height: '100%',
		width: '100%',
		overflow: 'auto'
	},
	textField: {
		float: 'left',
		width: '50%',
		height: '100%'
	},
	darkListItem: {
		backgroundColor: 'lightGrey'
	}
}));

function MessageTemplateComposer() {
	const classes = useStyles();

	return (
		<div>
			<TextField
				label="Message"
				multiline
				rows={15}
				variant="outlined"
				className={classes.textField}
			/>
			<div className={classes.listContainer}>
				<Typography color="primary" variant="h5" display="inline">Variables</Typography>
				<List className={classes.list} dense={false}>
					<ListItem className={classes.darkListItem}>
						<ListItemText primary="Testfdgfgdfgfdgdfgdfgfdgdgdfgdfgdfgdfgdfgdfg" />
					</ListItem>
					<ListItem>
						<ListItemText primary="Test" />
					</ListItem>
					<ListItem className={classes.darkListItem}>
						<ListItemText primary="Test" />
					</ListItem>
				</List>
			</div>
		</div>
	);
}


MessageTemplateComposer.propTypes = {
};

export default MessageTemplateComposer;
