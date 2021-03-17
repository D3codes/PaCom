import React from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@material-ui/core';
import { Publish, Send } from '@material-ui/icons';

import reportExporter from '../../utilities/reportExporter';

const useStyles = makeStyles({
	actionContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	}
});

const handleExport = () => {
	reportExporter.exportReport('test');
};

function ReportActions({ sendDisabled = false }) {
	const classes = useStyles();

	return (
		<div className={classes.actionContainer}>
			<Button onClick={handleExport} color="primary" startIcon={<Publish />} variant="contained">Export</Button>
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
	sendDisabled: PropTypes.bool
};

export default ReportActions;
