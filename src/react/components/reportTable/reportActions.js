import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles, LinearProgress } from '@material-ui/core';
import { Publish, Send, AllInbox } from '@material-ui/icons';

const DRAWER_WIDTH = 206;

const useStyles = makeStyles(theme => ({
	actionContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		backgroundColor: theme.palette.background.default
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
	onSend, onExport, sendDisabled = false, progress = 0, isSending = false, onSendToClick
}) {
	const classes = useStyles();

	return (
		<Fragment>
			<div className={classes.actionContainer}>
				<div className={classes.actionContainer}>
					<Button onClick={onExport} color="secondary" startIcon={<Publish />} variant={isSending ? 'outlined' : 'contained'} disabled={isSending}>Export</Button>
					<Button
						className={classes.sendButton}
						onClick={onSendToClick}
						color="secondary"
						disabled={sendDisabled}
						startIcon={<AllInbox />}
						variant={sendDisabled ? 'outlined' : 'contained'}>
						Send To
					</Button>
				</div>
				<Button
					onClick={onSend}
					color="primary"
					disabled={sendDisabled}
					endIcon={<Send />}
					variant={sendDisabled ? 'outlined' : 'contained'}>
						Send
				</Button>
			</div>
			{isSending && progress > 0 && progress < 100 && <LinearProgress className={classes.progressBar} variant="determinate" value={progress} />}
		</Fragment>
	);
}

ReportActions.propTypes = {
	onSend: PropTypes.func.isRequired,
	onExport: PropTypes.func.isRequired,
	sendDisabled: PropTypes.bool,
	progress: PropTypes.number,
	isSending: PropTypes.bool,
	onSendToClick: PropTypes.func.isRequired
};

export default ReportActions;
