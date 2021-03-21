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

function ReportActions({ onExport, sendDisabled = false }) {
	const classes = useStyles();

	return (
		<div className={classes.actionContainer}>
			<Button onClick={onExport} color="primary" startIcon={<Publish />} variant="contained">Export</Button>
			<Button
				color="primary"
				disabled={sendDisabled}
				endIcon={<Send />}
				variant={sendDisabled ? 'outlined' : 'contained'}>
				Send
			</Button>
		</div>
	);
}

ReportActions.propTypes = {
	onExport: PropTypes.func.isRequired,
	sendDisabled: PropTypes.bool
};

export default ReportActions;
