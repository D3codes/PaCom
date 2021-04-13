import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles, LinearProgress } from '@material-ui/core';
import { Publish, Send } from '@material-ui/icons';

const DRAWER_WIDTH = 206;

const useStyles = makeStyles(theme => ({
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
	},
	sendButton: {
		marginLeft: theme.spacing()
	}
}));

function ReportActions({
	onSend, onExport, sendDisabled = false, progress = 0, exportDisabled = false
}) {
	const classes = useStyles();

	return (
		<Fragment>
			<div className={classes.actionContainer}>
				<Button onClick={onExport} color="primary" startIcon={<Publish />} variant={exportDisabled ? 'outlined' : 'contained'} disabled={exportDisabled}>Export</Button>
				<div className={classes.actionContainer}>
					{/* TODO: Enable in 2.1
					<Button
						onClick={() => console.log('TODO: open send to modal')}
						color="secondary"
						disabled={sendDisabled}
						endIcon={<AllInbox />}
						variant={sendDisabled ? 'outlined' : 'contained'}>
						Send To
					</Button>
					*/}
					<Button
						className={classes.sendButton}
						onClick={onSend}
						color="primary"
						disabled={sendDisabled}
						endIcon={<Send />}
						variant={sendDisabled ? 'outlined' : 'contained'}>
						Send
					</Button>
				</div>
			</div>
			{progress > 0 && progress < 100 && <LinearProgress className={classes.progressBar} variant="determinate" value={progress} />}
		</Fragment>
	);
}

ReportActions.propTypes = {
	onSend: PropTypes.func.isRequired,
	onExport: PropTypes.func.isRequired,
	sendDisabled: PropTypes.bool,
	progress: PropTypes.number,
	exportDisabled: PropTypes.bool
};

export default ReportActions;
