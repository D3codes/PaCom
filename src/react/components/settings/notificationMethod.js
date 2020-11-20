import React, { useState, Fragment } from 'react';
import {
	PermPhoneMsg, AddComment
} from '@material-ui/icons';
import { Typography, Button, Divider, Checkbox, FormControlLabel} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	content: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column'
	},
	buttonContent: {
		display: 'flex',
		flexDirection: 'column'
	},
	button: {
		marginTop: theme.spacing(),
		marginBottom: theme.spacing()
	},
	actionButtonContainer: {
		display: 'flex',
		justifyContent: 'space-between'
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

const BEHAVIOR = {
	preferredOnly: 0,
	preferredAndSms: 1
};

export default function NotificationMethod({ sharedConfig, reloadSettings }) {
    const classes = useStyles();
    const [selectedOption, setSelectedOption] = useState(BEHAVIOR.preferredOnly);
    
    return (
		<div className={classes.root}>
			<Typography>Notification Method Component</Typography>
            <Button
					onClick={() => { setSelectedOption(BEHAVIOR.preferredOnly); }}
					className={classes.button}
					color="primary"
					classes={{ root: classes.buttonRoot, outlinedPrimary: selectedOption === BEHAVIOR.preferredOnly ? '' : classes.invisibleOutline }}
					variant="outlined"
					startIcon={(
						<Fragment>
							<PermPhoneMsg style={{ fontSize: '3rem', textAlign: 'left' }} />
							<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						</Fragment>
					)}>
					<div className={classes.buttonContent}>
						<Typography variant="h5">Preferred Contact Method Only</Typography>
						<Typography>Send messages to patient's preferred contact method only.</Typography>
					</div>
			</Button>
            <Button
					onClick={() => { setSelectedOption(BEHAVIOR.preferredAndSms); }}
					className={classes.button}
					color="primary"
					classes={{ root: classes.buttonRoot, outlinedPrimary: selectedOption === BEHAVIOR.preferredAndSms ? '' : classes.invisibleOutline }}
					variant="outlined"
					startIcon={(
						<Fragment>
							<AddComment style={{ fontSize: '3rem', textAlign: 'left' }} />
							<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						</Fragment>
					)}>
					<div className={classes.buttonContent}>
						<Typography variant="h5">Preferred Contact Method And SMS</Typography>
						<Typography>Send messages to patient's preferred contact method and as SMS.</Typography>
					</div>
			</Button>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={false}
                        name="checkedB"
                        color="primary"
                    />
                }
                label="Send SMS to phone number if cell is not available"
            />
		</div>
	);
}

NotificationMethod.propTypes = {
};
