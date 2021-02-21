import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	TextField, List, ListItem, ListItemText, Typography
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
	root: {
		height: '100%'
	},
	listContainer: {
		float: 'left',
		width: 'calc(50% - 10px)',
		overflowY: 'auto',
		height: '100%'
	},
	list: {
		width: '100%',
		overflowY: 'auto'
	},
	textField: {
		float: 'left',
		width: '50%',
		height: '100%',
		marginRight: '10px'
	},
	darkListItem: {
		backgroundColor: 'lightGrey',
		borderRadius: '10px'
	},
	lightListItem: {
		borderRadius: '10px'
	}
}));

const variables = ['var1', 'var2', 'var3', 'var4', 'var5', 'var6', 'var7', 'var8', 'var9', 'var10', 'var11', 'var12', 'var13'];

function MessageTemplateComposer() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
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
					{variables.map((variable, index) => (
						<ListItem className={index % 2 === 0 ? classes.darkListItem : classes.lightListItem}>
							<ListItemText primary={variable} />
						</ListItem>
					))}
				</List>
			</div>
		</div>
	);
}


MessageTemplateComposer.propTypes = {
};

export default MessageTemplateComposer;
