import React, { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography, Button, Accordion, AccordionDetails, AccordionSummary, Divider
} from '@material-ui/core';
import {
	Save, ExpandMore, Today, SettingsPhone
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import persistentStorage from '../../utilities/persistentStorage';
import ContactPreferences from './contactPreferences';
import DateVerification from './dateVerification';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	actionButtonContainer: {
		display: 'flex',
		alignSelf: 'flex-end'
	},
	contactPreferencesContainer: {
		flex: 1
	},
	adornmentDivider: {
		margin: theme.spacing()
	},
	accordionDetails: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	accordionIcon: {
		fontSize: '3rem',
		textAlign: 'left'
	},
	accordionSummaryText: {
		color: theme.palette.text.primary,
		alignSelf: 'center'
	}
}));

const ACCORDIONS = {
	DATE_VERIFICATION: 1,
	CONTACT_PREFERENCES: 2
};

export default function CustomMessageSettings({ customMessages, reloadSettings, hasWritePermission }) {
	const classes = useStyles();
	const [sendToPreferredAndSms, setSendToPreferredAndSms] = useState(customMessages.contactPreferences.sendToPreferredAndSms);
	const [textHomeIfCellNotAvailable, setTextHomeIfCellNotAvailable] = useState(customMessages.contactPreferences.textHomeIfCellNotAvailable);
	const [dateVerification, setDateVerification] = useState(customMessages.dateVerification);

	const [openAccordion, setOpenAccordion] = useState(null);

	const changesToSave = useMemo(() => (
		sendToPreferredAndSms !== customMessages.contactPreferences.sendToPreferredAndSms
		|| textHomeIfCellNotAvailable !== customMessages.contactPreferences.textHomeIfCellNotAvailable
		|| dateVerification.allowSendOutsideRange !== customMessages.dateVerification.allowSendOutsideRange
		|| dateVerification.numberOfDays !== customMessages.dateVerification.numberOfDays
		|| dateVerification.endOfRange !== customMessages.dateVerification.endOfRange
		|| dateVerification.useBusinessDays !== customMessages.dateVerification.useBusinessDays
	), [sendToPreferredAndSms, textHomeIfCellNotAvailable, customMessages, dateVerification]);

	const handleSave = () => {
		if (sendToPreferredAndSms !== customMessages.contactPreferences.sendToPreferredAndSms) {
			persistentStorage.setSendToPreferredAndSmsForCustomMessages(sendToPreferredAndSms);
		}
		if (textHomeIfCellNotAvailable !== customMessages.contactPreferences.textHomeIfCellNotAvailable) {
			persistentStorage.setTextHomeIfCellNotAvailableForCustomMessages(textHomeIfCellNotAvailable);
		}
		if (dateVerification.allowSendOutsideRange !== customMessages.dateVerification.allowSendOutsideRange) {
			persistentStorage.setAllowSendOutsideRangeForCustomMessages(dateVerification.allowSendOutsideRange);
		}
		if (dateVerification.numberOfDays !== customMessages.dateVerification.numberOfDays) persistentStorage.setNumberOfDaysForCustomMessages(dateVerification.numberOfDays);
		if (dateVerification.endOfRange !== customMessages.dateVerification.endOfRange) persistentStorage.setEndOfRangeForCustomMessage(dateVerification.endOfRange);
		if (dateVerification.useBusinessDays !== customMessages.dateVerification.useBusinessDays) {
			persistentStorage.setUseBusinessDaysForCustomMessages(dateVerification.useBusinessDays);
		}
		reloadSettings();
	};

	return (
		<div className={classes.root}>
			<div className={classes.accordionDetails}>
				<Accordion
					expanded={openAccordion === ACCORDIONS.DATE_VERIFICATION}
					onChange={(event, expanded) => setOpenAccordion(expanded ? ACCORDIONS.DATE_VERIFICATION : null)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Today color="primary" className={classes.accordionIcon} />
						<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						<Typography className={classes.accordionSummaryText} variant="h4">Date Verification</Typography>
					</AccordionSummary>
					<AccordionDetails className={classes.accordionDetails}>
						<DateVerification
							dateVerification={dateVerification}
							onChange={setDateVerification}
							hasWritePermission={hasWritePermission}
						/>
					</AccordionDetails>
				</Accordion>
				<Accordion
					expanded={openAccordion === ACCORDIONS.CONTACT_PREFERENCES}
					onChange={(event, expanded) => setOpenAccordion(expanded ? ACCORDIONS.CONTACT_PREFERENCES : null)}>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<SettingsPhone color="primary" className={classes.accordionIcon} />
						<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						<Typography className={classes.accordionSummaryText} variant="h4">Contact Preferences</Typography>
					</AccordionSummary>
					<AccordionDetails className={classes.accordionDetails}>
						<ContactPreferences
							sendToPreferredAndSms={sendToPreferredAndSms}
							setSendToPreferredAndSms={setSendToPreferredAndSms}
							textHomeIfCellNotAvailable={textHomeIfCellNotAvailable}
							setTextHomeIfCellNotAvailable={setTextHomeIfCellNotAvailable}
							hasWritePermission={hasWritePermission}
						/>
					</AccordionDetails>
				</Accordion>
			</div>
			<div className={classes.actionButtonContainer}>
				<Button
					disabled={!hasWritePermission || !changesToSave}
					endIcon={<Save />}
					color="primary"
					variant={(hasWritePermission && changesToSave) ? 'contained' : 'outlined'}
					onClick={handleSave}>
						Save
				</Button>
			</div>
		</div>
	);
}

CustomMessageSettings.propTypes = {
	customMessages: PropTypes.shape(
		{
			dateVerification: PropTypes.shape({
				numberOfDays: PropTypes.number,
				endOfRange: PropTypes.number,
				allowSendOutsideRange: PropTypes.number,
				useBusinessDays: PropTypes.bool
			}),
			contactPreferences: PropTypes.shape({
				sendToPreferredAndSms: PropTypes.bool,
				textHomeIfCellNotAvailable: PropTypes.bool
			})
		}
	).isRequired,
	reloadSettings: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired
};
