import React, { useState, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Save } from '@material-ui/icons';
import {
	Typography, Select, FormControl, MenuItem, Button, Tabs, Tab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import persistentStorage from '../../utilities/persistentStorage';
import ContactPreferences from './contactPreferences';
import DateVerification from './dateVerification';
import SendTo from './sendTo';
import Provider from '../../models/provider';
import Template from '../../models/template';
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
		alignSelf: 'flex-end'
	},
	tabContent: {
		height: '100%'
	},
	tabContainer: {
		height: `calc(100% - ${theme.spacing(5)}px)`
	},
	descriptionText: {
		marginBottom: theme.spacing(3)
	},
	defaultCallReminderContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	templateSelector: {
		width: `calc(50% - ${theme.spacing(3)}px)`
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
	},
	sendToContainer: {
		height: '90%'
	}
}));

const TABS = {
	DEFAULT_REMINDERS: 0,
	DEFAULT_SEND_TO: 1,
	DATE_VERIFICATION: 2,
	CONTACT_PREFERENCES: 3
};

export default function AppointmentRemindersSettings({
	appointmentReminders, providers, procedures, messageTemplates, reloadSettings, hasWritePermission = false
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

	const [openTab, setOpenTab] = useState(0);
	const [providerMappings, setProviderMappings] = useState(providers);
	const [procedureMappings, setProcedureMappings] = useState(procedures);

	const handleTabChange = (event, newValue) => {
		setOpenTab(newValue);
	};

	const mappingsMatch = (mapping1, mapping2) => {
		if (mapping1.length !== mapping2.length) return false;

		for (let i = 0; i < mapping1.length; i += 1) {
			if (!mapping2.some(x => (x.source === mapping1[i].source) && (x.sendToReminder === mapping1[i].sendToReminder))) return false;
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
						<Tab label="Default Recipients" />
						<Tab label="Date Verification" />
						<Tab label="Contact Preferences" />
					</Tabs>
				</div>
				<div className={classes.tabContent}>
					{openTab === TABS.DEFAULT_REMINDERS && (
						<Fragment>
							<Typography className={classes.descriptionText}>
							Select the message templates that will be sent for appointment reminders when no overrides are set.
							</Typography>
							<div className={classes.defaultCallReminderContainer}>
								<div className={classes.templateSelector}>
									<Typography variant="h6">Default Call Reminder Template</Typography>
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
									<Typography variant="h6">Default SMS Reminder Template</Typography>
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
						</Fragment>
					)}
					{openTab === TABS.DEFAULT_SEND_TO && (
						<Fragment>
							<Typography className={classes.descriptionText}>
							Select which Providers and Procedures should receive messages when sending appointment reminders.
							</Typography>
							<div className={classes.sendToContainer}>
								<SendTo
									providerMappings={providerMappings}
									procedureMappings={procedureMappings}
									onProvidersChange={setProviderMappings}
									onProceduresChange={setProcedureMappings}
									hasWritePermission={hasWritePermission}
									forAppointmentReminders
								/>
							</div>
						</Fragment>
					)}
					{openTab === TABS.DATE_VERIFICATION && (
						<DateVerification
							dateVerification={dateVerification}
							onChange={setDateVerification}
							hasWritePermission={hasWritePermission}
						/>
					)}
					{openTab === TABS.CONTACT_PREFERENCES && (
						<ContactPreferences
							sendToPreferredAndSms={sendToPreferredAndSms}
							setSendToPreferredAndSms={setSendToPreferredAndSms}
							textHomeIfCellNotAvailable={textHomeIfCellNotAvailable}
							setTextHomeIfCellNotAvailable={setTextHomeIfCellNotAvailable}
							hasWritePermission={hasWritePermission}
						/>
					)}
				</div>
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
	messageTemplates: PropTypes.arrayOf(PropTypes.instanceOf(Template)).isRequired,
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider)).isRequired,
	procedures: PropTypes.arrayOf(PropTypes.instanceOf(Procedure)).isRequired,
	reloadSettings: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool
};
