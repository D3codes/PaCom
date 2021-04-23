import React, {
	useState, useMemo, useEffect
} from 'react';
import PropTypes from 'prop-types';
import { Save } from '@material-ui/icons';
import {
	Typography, Select, FormControl, MenuItem, Button, Tabs, Tab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import persistentStorage from '../../utilities/persistentStorage';
import ContactPreferences from './contactPreferences';
import DateVerification from './dateVerification';
import DefaultSendTo from './defaultSendTo';
import Provider from '../../models/provider';
import Procedure from '../../models/procedure';
import { DRAWER_WIDTH } from '../drawer/miniDrawer';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
		marginTop: `${theme.mixins.toolbar.minHeight}px`
	},
	adornmentDivider: {
		margin: theme.spacing()
	},
	actionButtonContainer: {
		display: 'flex',
		alignSelf: 'flex-end'
	},
	tabContent: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		height: '100%'
	},
	tabContainer: {
		display: 'flex',
		flexDirection: 'column',
		height: `calc(100% - ${theme.spacing(3)}px)`
	},
	defaultCallReminderContainer: {
		display: 'flex',
		flex: 1,
		justifyContent: 'space-between',
		marginTop: theme.spacing(3)
	},
	templateSelector: {
		width: `calc(50% - ${theme.spacing(3)}px)`,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	templateLabel: {
		alignSelf: 'start'
	},
	form: {
		width: '100%'
	},
	navContainer: {
		backgroundColor: theme.palette.primary.main,
		position: 'absolute',
		top: `${theme.mixins.toolbar.minHeight}px`,
		left: `${DRAWER_WIDTH}px`,
		width: `calc(100% - ${DRAWER_WIDTH}px)`,
		zIndex: 1101,
		boxShadow: '0px 4px 5px 0px rgba(0,0,0,0.14)',
		color: 'white'
	}
}));

const TABS = {
	DEFAULT_REMINDERS: 0,
	DEFAULT_SEND_TO: 1,
	DATE_VERIFICATION: 2,
	CONTACT_PREFERENCES: 3
};

export default function AppointmentRemindersSettings({
	appointmentReminders, providers, procedures, reloadSettings, hasWritePermission
}) {
	const classes = useStyles();
	// Date Verification Values
	const [dateVerification, setDateVerification] = useState(appointmentReminders.dateVerification);

	// Contact Preferences Values
	const [sendToPreferredAndSms, setSendToPreferredAndSms] = useState(appointmentReminders.contactPreferences.sendToPreferredAndSms);
	const [textHomeIfCellNotAvailable, setTextHomeIfCellNotAvailable] = useState(appointmentReminders.contactPreferences.textHomeIfCellNotAvailable);

	// Default Reminder Values
	const [defaultPhoneReminder, setDefaultPhoneReminder] = useState(appointmentReminders.defaultReminderTemplates.phone);
	const [defaultSmsReminder, setDefaultSmsReminder] = useState(appointmentReminders.defaultReminderTemplates.sms);

	const [openTab, setopenTab] = useState(0);
	const [messageTemplates, setMessageTemplates] = useState(null);
	const [providerMappings, setProviderMappings] = useState(providers);
	const [procedureMappings, setProcedureMappings] = useState(procedures);

	const handleTabChange = (event, newValue) => {
		setopenTab(newValue);
	};

	useEffect(() => {
		persistentStorage.getMessageTemplates()
			.then(setMessageTemplates)
			.then(() => persistentStorage.getProviderMappings());
	}, []);

	const mappingsMatch = (array1, array2) => {
		if (array1.length !== array2.length) return false;

		for (let i = 0; i < array1.length; i += 1) {
			if (!array2.some(x => (x.source === array1[i].source) && (x.sendToReminder === array1[i].sendToReminder))) {
				console.log(array1[i], array1, array2);
				return false;
			}
		}

		return true;
	};

	const changesToSave = useMemo(() => (
		dateVerification.allowSendOutsideRange !== appointmentReminders.dateVerification.allowSendOutsideRange
		|| dateVerification.numberOfDays !== appointmentReminders.dateVerification.numberOfDays
		|| dateVerification.endOfRange !== appointmentReminders.dateVerification.endOfRange
		|| dateVerification.useBusinessDays !== appointmentReminders.dateVerification.useBusinessDays
		|| sendToPreferredAndSms !== appointmentReminders.contactPreferences.sendToPreferredAndSms
		|| textHomeIfCellNotAvailable !== appointmentReminders.contactPreferences.textHomeIfCellNotAvailable
		|| defaultPhoneReminder !== appointmentReminders.defaultReminderTemplates.phone
		|| defaultSmsReminder !== appointmentReminders.defaultReminderTemplates.sms
		|| !mappingsMatch(providerMappings, providers)
		|| !mappingsMatch(procedureMappings, procedures)
	), [
		dateVerification,
		sendToPreferredAndSms,
		textHomeIfCellNotAvailable,
		defaultPhoneReminder,
		defaultSmsReminder,
		appointmentReminders,
		providerMappings,
		procedureMappings,
		providers,
		procedures
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
		if (!mappingsMatch(providerMappings, providers)) {
			providerMappings.forEach(provider => { persistentStorage.addProviderMapping(provider); });
		}
		if (!mappingsMatch(procedureMappings, procedures)) {
			procedureMappings.forEach(procedure => { persistentStorage.addProcedureMapping(procedure); });
		}
		reloadSettings();
	};

	return (
		<div className={classes.root}>
			<div className={classes.tabContainer}>
				<div className={classes.navContainer}>
					<Tabs
						value={openTab}
						onChange={handleTabChange}>
						<Tab label="Default Reminder Templates" />
						<Tab label="Default Send To" />
						<Tab label="Date Verification" />
						<Tab label="Contact Preferences" />
					</Tabs>
				</div>
				{openTab === TABS.DEFAULT_REMINDERS && (
					<div className={classes.tabContent}>
						<Typography>Select the message templates that will be used while sending appointment reminders when no overrides are set.</Typography>
						<div className={classes.defaultCallReminderContainer}>
							<div className={classes.templateSelector}>
								<Typography className={classes.templateLabel} variant="h6">Default Call Reminder Template</Typography>
								<FormControl className={classes.form} variant="outlined">
									<Select
										value={messageTemplates && defaultPhoneReminder ? defaultPhoneReminder || '' : ''}
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
							<div className={classes.templateSelector}>
								<Typography className={classes.templateLabel} variant="h6">Default SMS Reminder Template</Typography>
								<FormControl className={classes.form} variant="outlined">
									<Select
										value={messageTemplates && defaultSmsReminder ? defaultSmsReminder || '' : ''}
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
						</div>
					</div>
				)}
				{openTab === TABS.DEFAULT_SEND_TO && (
					<div className={classes.tabContent}>
						<DefaultSendTo
							providerMappings={providerMappings}
							procedureMappings={procedureMappings}
							onProvidersChange={setProviderMappings}
							onProceduresChange={setProcedureMappings}
							hasWritePermission={hasWritePermission}
							forAppointmentReminders
						/>
					</div>
				)}
				{openTab === TABS.DATE_VERIFICATION && (
					<div className={classes.tabContent}>
						<DateVerification
							dateVerification={dateVerification}
							onChange={setDateVerification}
							hasWritePermission={hasWritePermission}
						/>
					</div>
				)}
				{openTab === TABS.CONTACT_PREFERENCES && (
					<div className={classes.tabContent}>
						<ContactPreferences
							sendToPreferredAndSms={sendToPreferredAndSms}
							setSendToPreferredAndSms={setSendToPreferredAndSms}
							textHomeIfCellNotAvailable={textHomeIfCellNotAvailable}
							setTextHomeIfCellNotAvailable={setTextHomeIfCellNotAvailable}
							hasWritePermission={hasWritePermission}
						/>
					</div>
				)}
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
			}),
			doNotSendTo: PropTypes.shape({
				providers: PropTypes.arrayOf(PropTypes.string),
				procedures: PropTypes.arrayOf(PropTypes.string)
			})
		}
	).isRequired,
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider)).isRequired,
	procedures: PropTypes.arrayOf(PropTypes.instanceOf(Procedure)).isRequired,
	reloadSettings: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired
};
