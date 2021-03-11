import React from 'react';
import PropTypes from 'prop-types';
import {
	Typography, Checkbox, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, Divider
} from '@material-ui/core';
import { ExpandMore, SettingsPhone } from '@material-ui/icons';
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

export default function ContactPreferences({
	sendToPreferredAndSms, setSendToPreferredAndSms, textHomeIfCellNotAvailable, setTextHomeIfCellNotAvailable, hasWritePermission
}) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMore />}
					id="dateVerification-header">
					<SettingsPhone color="primary" style={{ fontSize: '3rem', textAlign: 'left' }} />
					<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
					<Typography color="primary" variant="h4">Contact Preferences</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.root}>
					<FormControlLabel
						control={(
							<Checkbox
								data-testid="preferredAndSms-id"
								disabled={!hasWritePermission}
								onChange={event => { setSendToPreferredAndSms(event.target.checked); }}
								checked={sendToPreferredAndSms}
								color="primary"
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
								color="primary"
							/>
						)}
						label="Send SMS to home phone number if cell is not available"
					/>
				</AccordionDetails>
			</Accordion>
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
