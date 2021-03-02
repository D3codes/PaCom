import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	TextField, List, ListItem, ListItemText, Typography, Card
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {
		height: '100%'
	},
	listContainer: {
		float: 'left',
		width: 'calc(50% - 10px)',
		overflowY: 'hidden',
		height: '90%'
	},
	list: {
		width: '100%',
		overflowY: 'auto',
		height: '100%'
	},
	textField: {
		float: 'left',
		width: '50%',
		height: '100%',
		marginRight: '10px',
		marginTop: '32px'
	},
	darkListItem: {
		backgroundColor: 'gainsboro'
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
			<Typography color="primary" variant="h5" display="inline">Variables</Typography>
			<Card className={classes.listContainer}>
				<List className={classes.list} dense={false}>
					{variables.map((variable, index) => (
						<ListItem className={index % 2 === 0 ? classes.darkListItem : ''}>
							<ListItemText primary={variable} />
						</ListItem>
					))}
				</List>
			</Card>
		</div>
	);
}


MessageTemplateComposer.propTypes = {
};

export default MessageTemplateComposer;
