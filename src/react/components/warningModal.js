import React from 'react';
import PropTypes from 'prop-types';
import {
	Modal, Typography, makeStyles, Button
} from '@material-ui/core';
import { Warning, Error } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative'
	},
	content: {
		backgroundColor: 'white'
	},
	warningIcon: {
		color: theme.palette.warning.main
	},
	errorIcon: {
		color: theme.palette.error.main
	},
	title: {
		fontSize: 'medium'
	},
	message: {
		fontSize: 'small'
	}
}));

function WarningModal({
	type, title, message, buttonText, showModal, closeAction
}) {
	const classes = useStyles();

	return (
		<Modal className={classes.root} open={showModal}>
			<div className={classes.content}>
				<Typography className={classes.title}>{title}</Typography>
				{type === 'warning'
					? <Warning color="inherit" className={classes.warningIcon} />
					: <Error color="inherit" className={classes.errorIcon} />}
				<Typography className={classes.message}>{message}</Typography>
				<Button onClick={closeAction}>{buttonText}</Button>
			</div>
		</Modal>
	);
}

WarningModal.propTypes = {
	type: PropTypes.oneOf(['warning, error']).isRequired,
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	buttonText: PropTypes.string.isRequired,
	showModal: PropTypes.bool.isRequired,
	closeAction: PropTypes.func.isRequired
};

export default WarningModal;
