import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles, LinearProgress } from '@material-ui/core';
import { Publish, Send } from '@material-ui/icons';

const DRAWER_WIDTH = 206;

const useStyles = makeStyles(() => ({
	actionContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	progressBar: {
		position: 'fixed',
		bottom: 0,
		left: DRAWER_WIDTH,
		right: 0,
		height: '10px'
	}
}));

function ReportActions({
	onSend, onExport, sendDisabled = false, progress = 0
}) {
	const classes = useStyles();

	return (
		<Fragment>
			<div className={classes.actionContainer}>
				<Button onClick={onExport} color="primary" startIcon={<Publish />} variant="contained">Export</Button>
				<Button
					onClick={onSend}
					color="primary"
					disabled={sendDisabled}
					endIcon={<Send />}
					variant={sendDisabled ? 'outlined' : 'contained'}>
					Send
				</Button>
			</div>
			{progress > 0 && progress < 100 && <LinearProgress className={classes.progressBar} variant="determinate" value={progress} />}
		</Fragment>
	);
}

ReportActions.propTypes = {
	onSend: PropTypes.func.isRequired,
	onExport: PropTypes.func.isRequired,
	sendDisabled: PropTypes.bool,
	progress: PropTypes.number
};

export default ReportActions;
