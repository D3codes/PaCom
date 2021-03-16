import React from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@material-ui/core';
import { Publish, Send } from '@material-ui/icons';

const useStyles = makeStyles({
	actionContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	}
});

function ReportActions({ sendDisabled = false }) {
	const classes = useStyles();

	return (
		<div className={classes.actionContainer}>
			<Button color="primary" startIcon={<Publish />} variant="contained">Export</Button>
			<Button color="primary" disabled={sendDisabled} endIcon={<Send />} variant="contained">Send</Button>
		</div>
	);
}

ReportActions.propTypes = {
	sendDisabled: PropTypes.bool
};

export default ReportActions;
