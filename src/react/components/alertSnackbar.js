import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Slide } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

function AlertSnackbar({
	severity, title = '', message = '', open, onClose = null, autoHideDuration = null
}) {
	return (
		<Snackbar
			TransitionComponent={Slide}
			autoHideDuration={autoHideDuration}
			onClose={onClose}
			open={open}>
			<Alert
				onClose={onClose}
				severity={severity}>
				{title && <AlertTitle>{title}</AlertTitle>}
				{message}
			</Alert>
		</Snackbar>
	);
}

AlertSnackbar.Severities = {
	Warning: 'warning',
	Error: 'error',
	Info: 'info',
	Success: 'success'
};


AlertSnackbar.propTypes = {
	severity: PropTypes.oneOf(Object.values(AlertSnackbar.Severities)).isRequired,
	title: PropTypes.string,
	message: PropTypes.string,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func,
	autoHideDuration: PropTypes.number
};

export default AlertSnackbar;
