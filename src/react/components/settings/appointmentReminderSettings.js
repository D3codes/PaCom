import React, {
	useState, useMemo, useEffect
} from 'react';
import PropTypes from 'prop-types';
import {
	Save, ExpandMore, Today, Schedule, SettingsPhone
} from '@material-ui/icons';
import {
	Typography, Divider, Select, FormControl, MenuItem, Button, Accordion, AccordionSummary, AccordionDetails
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import persistentStorage from '../../utilities/persistentStorage';
import ContactPreferences from './contactPreferences';
import DateVerification from './dateVerification';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	adornmentDivider: {
		margin: theme.spacing()
	},
	actionButtonContainer: {
		display: 'flex',
		alignSelf: 'flex-end'
	},
	accordion: {
		marginBottom: theme.spacing()
	},
	accordionDetails: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	}
}));

export default function AppointmentRemindersSettings({ appointmentReminders, reloadSettings, hasWritePermission }) {
	const classes = useStyles();
	// Date Verification Values
	const [dateVerification, setDateVerification] = useState(appointmentReminders.dateVerification);

	// Contact Preferences Values
	const [sendToPreferredAndSms, setSendToPreferredAndSms] = useState(appointmentReminders.contactPreferences.sendToPreferredAndSms);
	const [textHomeIfCellNotAvailable, setTextHomeIfCellNotAvailable] = useState(appointmentReminders.contactPreferences.textHomeIfCellNotAvailable);

	// Default Reminder Values
	const [defaultPhoneReminder, setDefaultPhoneReminder] = useState(appointmentReminders.defaultReminderTemplates.phone);
	const [defaultSmsReminder, setDefaultSmsReminder] = useState(appointmentReminders.defaultReminderTemplates.sms);

	const [openAccordion, setOpenAccordion] = useState(null);
	const [messageTemplates, setMessageTemplates] = useState(null);

	useEffect(() => {
		persistentStorage.getMessageTemplates().then(setMessageTemplates);
	}, []);

	const changesToSave = useMemo(() => (
		dateVerification.allowSendOutsideRange !== appointmentReminders.dateVerification.allowSendOutsideRange
		|| dateVerification.numberOfDays !== appointmentReminders.dateVerification.numberOfDays
		|| dateVerification.endOfRange !== appointmentReminders.dateVerification.endOfRange
		|| dateVerification.useBusinessDays !== appointmentReminders.dateVerification.useBusinessDays
		|| sendToPreferredAndSms !== appointmentReminders.contactPreferences.sendToPreferredAndSms
		|| textHomeIfCellNotAvailable !== appointmentReminders.contactPreferences.textHomeIfCellNotAvailable
		|| defaultPhoneReminder !== appointmentReminders.defaultReminderTemplates.phone
		|| defaultSmsReminder !== appointmentReminders.defaultReminderTemplates.sms
	), [
		dateVerification,
		sendToPreferredAndSms,
		textHomeIfCellNotAvailable,
		defaultPhoneReminder,
		defaultSmsReminder,
		appointmentReminders
	]);

	const handleSave = () => {
		if (dateVerification.allowSendOutsideRange !== appointmentReminders.dateVerification.allowSendOutsideRange) {
			persistentStorage.setAllowSendOutsideRange(dateVerification.allowSendOutsideRange);
		}
		if (dateVerification.numberOfDays !== appointmentReminders.dateVerification.numberOfDays) persistentStorage.setNumberOfDays(dateVerification.numberOfDays);
		if (dateVerification.endOfRange !== appointmentReminders.dateVerification.endOfRange) persistentStorage.setEndOfRange(dateVerification.endOfRange);
		if (dateVerification.useBusinessDays !== appointmentReminders.dateVerification.useBusinessDays) persistentStorage.setUseBusinessDays(dateVerification.useBusinessDays);
		if (sendToPreferredAndSms !== appointmentReminders.contactPreferences.sendToPreferredAndSms) persistentStorage.setSendToPreferredAndSmsForReminders(sendToPreferredAndSms);
		if (textHomeIfCellNotAvailable !== appointmentReminders.contactPreferences.textHomeIfCellNotAvailable) {
			persistentStorage.setTextHomeIfCellNotAvailableForReminders(textHomeIfCellNotAvailable);
		}
		if (defaultPhoneReminder !== appointmentReminders.defaultReminderTemplates.phone) persistentStorage.setDefaultPhoneReminder(defaultPhoneReminder);
		if (defaultSmsReminder !== appointmentReminders.defaultReminderTemplates.sms) persistentStorage.setDefaultSmsReminder(defaultSmsReminder);
		reloadSettings();
	};

	const ACCORDIONS = {
		DEFAULT_REMINDERS: 1,
		DATE_VERIFICATION: 2,
		CONTACT_PREFERENCES: 3
	};

	return (
		<div className={classes.root}>
			<Accordion
				expanded={openAccordion === ACCORDIONS.DEFAULT_REMINDERS}
				onChange={(event, expanded) => setOpenAccordion(expanded ? ACCORDIONS.DEFAULT_REMINDERS : null)}
				className={classes.accordion}>
				<AccordionSummary
					expandIcon={<ExpandMore />}
					id="dateVerification-header">
					<Schedule color="primary" style={{ fontSize: '3rem', textAlign: 'left' }} />
					<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
					<Typography color="primary" variant="h4">Default Appointment Reminders</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.accordionDetails}>
					<div className={classes.defaultCallReminderContainer}>
						<Typography variant="h5" color="primary">Default Call Reminder Template</Typography>
						<Typography>This will be the message template that is used when sending appointment reminders via phone call and no overrides are selected.</Typography>
						<FormControl variant="outlined">
							<Select
								value={defaultPhoneReminder || ''}
								disabled={!hasWritePermission}
								onChange={event => { setDefaultPhoneReminder(event.target.value); }}
								inputProps={{ 'aria-label': 'Without label' }}>
								{messageTemplates && messageTemplates.map(template => (
									<MenuItem value={template.name} key={JSON.stringify(template)}>
										{template.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<Divider className={classes.adornmentDivider} />
					<div>
						<Typography variant="h5" color="primary">Default SMS Reminder Template</Typography>
						<Typography>This will be the message template that is used when sending appointment reminders via SMS message and no overrides are selected.</Typography>
						<FormControl variant="outlined">
							<Select
								value={defaultSmsReminder || ''}
								disabled={!hasWritePermission}
								onChange={event => { setDefaultSmsReminder(event.target.value); }}
								inputProps={{ 'aria-label': 'Without label' }}>
								{messageTemplates && messageTemplates.map(template => (
									<MenuItem value={template.name} key={JSON.stringify(template)}>
										{template.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				</AccordionDetails>
			</Accordion>
			<Accordion
				expanded={openAccordion === ACCORDIONS.DATE_VERIFICATION}
				onChange={(event, expanded) => setOpenAccordion(expanded ? ACCORDIONS.DATE_VERIFICATION : null)}
				className={classes.accordion}>
				<AccordionSummary
					expandIcon={<ExpandMore />}
					id="dateVerification-header">
					<Today color="primary" style={{ fontSize: '3rem', textAlign: 'left' }} />
					<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
					<Typography color="primary" variant="h4">Date Verification</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.accordionDetails}>
					<DateVerification
						dateVerification={dateVerification}
						setDateVerification={setDateVerification}
						hasWritePermission={hasWritePermission}
					/>
				</AccordionDetails>
			</Accordion>
			<div className={classes.accordionDetails}>
				<Accordion
					expanded={openAccordion === ACCORDIONS.CONTACT_PREFERENCES}
					onChange={(event, expanded) => setOpenAccordion(expanded ? ACCORDIONS.CONTACT_PREFERENCES : null)}>
					<AccordionSummary
						expandIcon={<ExpandMore />}
						id="dateVerification-header">
						<SettingsPhone color="primary" style={{ fontSize: '3rem', textAlign: 'left' }} />
						<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						<Typography color="primary" variant="h4">Contact Preferences</Typography>
					</AccordionSummary>
					<AccordionDetails>
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

AppointmentRemindersSettings.propTypes = {
	appointmentReminders: PropTypes.shape(
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
			}),
			defaultReminderTemplates: PropTypes.shape({
				phone: PropTypes.string,
				sms: PropTypes.string
			})
		}
	).isRequired,
	reloadSettings: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired
};
