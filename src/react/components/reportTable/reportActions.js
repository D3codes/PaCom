import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Publish, Send } from '@material-ui/icons';

const useStyles = makeStyles({
	actionContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	}
});

function ReportActions() {
	const classes = useStyles();

	return (
		<div className={classes.actionContainer}>
			<Button color="primary" startIcon={<Publish />} variant="contained">Export</Button>
			<Button color="primary" endIcon={<Send />} variant="contained">Send</Button>
		</div>
	);
}

export default ReportActions;
