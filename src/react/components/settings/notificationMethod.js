import React, { useState, Fragment } from 'react';
import {
	PermPhoneMsg, AddComment
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import { Typography, Button, Divider, Checkbox, FormControlLabel} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	buttonContent: {
		display: 'flex',
		flexDirection: 'column'
	},
	button: {
		marginTop: theme.spacing(),
		marginBottom: theme.spacing()
	},
	adornmentDivider: {
		margin: theme.spacing()
	},
	buttonRoot: {
		textTransform: 'none',
		justifyContent: 'flex-start',
		textAlign: 'left'
	},
	invisibleOutline: {
		borderColor: 'rgba(0,0,0,0)',
		'&:hover': {
			borderColor: 'rgba(0,0,0,0)'
		}
	}
}));

export default function NotificationMethod({ notificationMethod, reloadSettings }) {
    const classes = useStyles();
	const [sendToPreferredAndSms, setSendToPreferredAndSms] = useState(notificationMethod.sendToPreferredAndSms);
	const [textHome, setTextHome] = useState(notificationMethod.textHomeIfCellNotAvailable);
    
    return (
		<div className={classes.root}>
			<Typography variant="h4" color="primary">Notification Method</Typography>
			<FormControlLabel
                control={
                    <Checkbox
						onChange={event => {setSendToPreferredAndSms(event.target.checked)}}
                        checked={sendToPreferredAndSms}
                        color="primary"
                    />
                }
                label="Send messages via SMS as well as patient's preferred contact method."
            />
            <FormControlLabel
                control={
                    <Checkbox
						onChange={event => {setTextHome(event.target.checked)}}
                        checked={textHome}
                        color="primary"
                    />
                }
                label="Send SMS to home phone number if cell is not available"
            />
		</div>
	);
}

NotificationMethod.propTypes = {
	notificationMethod: PropTypes.shape(
		{
			sendToPreferredAndSms: PropTypes.bool,
			textHomeIfCellNotAvailable: PropTypes.bool
		}.isRequired
	),
	reloadSettings: PropTypes.func.isRequired
};