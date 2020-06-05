// Provider Mappings
const getProviderMappings = () => window.ipcRenderer.invoke('get-provider-mappings');

const addProviderMapping = mapping => window.ipcRenderer.invoke('add-provider-mapping', mapping);

const removeProviderMappingWithSource = providerSource => window.ipcRenderer.invoke('remove-provider-mapping', providerSource);

// Message Templates
const getMessageTemplates = () => window.ipcRenderer.invoke('get-message-templates');

const addMessageTemplate = template => window.ipcRenderer.invoke('add-message-template', template);

const removeMessageTemplateWithName = templateName => window.ipcRenderer.invoke('remove-message-template', templateName);

// Settings
const getSettings = (forceLocal = false) => window.ipcRenderer.invoke('get-settings', forceLocal);

const setSettings = (path, value, forceLocal = false) => window.ipcRenderer.invoke('set-settings', path, value, forceLocal);

const setAppointmentRemindersDateVerificationDays = days => setSettings('settings.appointmentReminders.dateVerification.numberOfDays', days);

const setAppointmentRemindersDateVerificationAllowSend = allow => setSettings('settings.appointmentReminders.dateVerification.allowSendOutsideRange', allow);

const setAppointmentRemindersNotificationMethodPreferredAndSms = preferredAndSms => setSettings(
	'settings.appointmentReminders.notificationMethod.sendToPreferredAndSms',
	preferredAndSms
);

const setAppointmentRemindersNotificationMethodTextHomeIfCellNotAvailable = textHome => setSettings(
	'settings.appointmentReminders.notificationMethod.textHomeIfCellNotAvailable',
	textHome
);

const setCustomMessagesNotificationMethodPreferredAndSms = preferredAndSms => setSettings('settings.customMessages.notificationMethod.sendToPreferredAndSms', preferredAndSms);

const setCustomMessagesNotificationMethodTextHomeIfCellNotAvailable = textHome => setSettings('settings.customMessages.notificationMethod.textHomeIfCellNotAvailable', textHome);

const setMessageReportsAutosave = autosave => setSettings('settings.messageReports.autosaveReports', autosave);

const setMessageReportsAutosaveLocation = location => setSettings('settings.messageReports.autosaveLocation', location);

const setMessageReportsLastReport = report => setSettings('settings.messageReports.lastReport', report);

const setTwilioSID = sid => setSettings('settings.twilio.SID', sid);

const setTwilioAuthToken = authToken => setSettings('settings.twilio.authToken', authToken);

const setTwilioPhoneNumber = phoneNumber => setSettings('settings.twilio.phoneNumber', phoneNumber);

const setTwilioSmsEndpoint = endpoint => setSettings('settings.twilio.smsEndpoint', endpoint);

const setTwilioCallEndpoint = endpoint => setSettings('settings.twilio.callEndpoint', endpoint);

const setShareConfigBehavior = behavior => setSettings('settings.shareData.behavior', behavior, true);

const setShareConfigLocation = location => setSettings('settings.shareData.location', location, true);

const setAdminAccess = hasAccess => setSettings('settings.adminAccess', hasAccess);

const copyLocalToNetwork = () => window.ipcRenderer.invoke('copy-local-to-network');

export default {
	getProviderMappings,
	addProviderMapping,
	removeProviderMappingWithSource,
	getMessageTemplates,
	addMessageTemplate,
	removeMessageTemplateWithName,
	getSettings,
	setAppointmentRemindersDateVerificationAllowSend,
	setAppointmentRemindersDateVerificationDays,
	setAppointmentRemindersNotificationMethodPreferredAndSms,
	setAppointmentRemindersNotificationMethodTextHomeIfCellNotAvailable,
	setCustomMessagesNotificationMethodPreferredAndSms,
	setCustomMessagesNotificationMethodTextHomeIfCellNotAvailable,
	setMessageReportsAutosave,
	setMessageReportsAutosaveLocation,
	setMessageReportsLastReport,
	setTwilioAuthToken,
	setTwilioSID,
	setTwilioSmsEndpoint,
	setTwilioCallEndpoint,
	setTwilioPhoneNumber,
	setShareConfigBehavior,
	setShareConfigLocation,
	setAdminAccess,
	copyLocalToNetwork
};
