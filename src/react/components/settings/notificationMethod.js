import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Checkbox, FormControlLabel} from '@material-ui/core';
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

export default function NotificationMethod({ sendToPreferredAndSms, setSendToPreferredAndSms, textHomeIfCellNotAvailable, setTextHomeIfCellNotAvailable, hasWritePermission }) {
    const classes = useStyles();
    
    return (
		<div className={classes.root}>
			<Typography variant="h4" color="primary">Notification Method</Typography>
			<FormControlLabel
                control={
                    <Checkbox
						disabled={!hasWritePermission}
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
						disabled={!hasWritePermission}
						onChange={event => {setTextHomeIfCellNotAvailable(event.target.checked)}}
                        checked={textHomeIfCellNotAvailable}
                        color="primary"
                    />
                }
                label="Send SMS to home phone number if cell is not available"
            />
		</div>
	);
}

NotificationMethod.propTypes = {
	sendToPreferredAndSms: PropTypes.bool.isRequired,
	setSendToPreferredAndSms: PropTypes.func.isRequired,
	textHomeIfCellNotAvailable: PropTypes.bool.isRequired,
	setTextHomeIfCellNotAvailable: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired
};