import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	}
});

export default function ContactPreferences({
	sendToPreferredAndSms, setSendToPreferredAndSms, textHomeIfCellNotAvailable, setTextHomeIfCellNotAvailable, hasWritePermission
}) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<FormControlLabel
				control={(
					<Checkbox
						data-testid="preferredAndSms-id"
						disabled={!hasWritePermission}
						onChange={event => { setSendToPreferredAndSms(event.target.checked); }}
						checked={sendToPreferredAndSms}
						color="secondary"
					/>
				)}
				label="Send messages via SMS as well as patient's preferred contact method"
			/>
			<FormControlLabel
				control={(
					<Checkbox
						data-testid="textHome-id"
						disabled={!hasWritePermission}
						onChange={event => { setTextHomeIfCellNotAvailable(event.target.checked); }}
						checked={textHomeIfCellNotAvailable}
						color="secondary"
					/>
				)}
				label="Send SMS to home phone number if cell is not available"
			/>
		</div>
	);
}

ContactPreferences.propTypes = {
	sendToPreferredAndSms: PropTypes.bool.isRequired,
	setSendToPreferredAndSms: PropTypes.func.isRequired,
	textHomeIfCellNotAvailable: PropTypes.bool.isRequired,
	setTextHomeIfCellNotAvailable: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired
};
