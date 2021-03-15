import Provider from '../models/provider';

// Dynamic Values
const getDynamicValues = (includeDefault = true) => window.ipcRenderer.invoke('get-dynamic-values', includeDefault);

const addDynamicValue = value => window.ipcRenderer.invoke('add-dynamic-value', value);

const removeDynamicValueWithName = valueName => window.ipcRenderer.invoke('remove-dynamic-value', valueName);

// Provider Mappings
const transformMappings = providerMappings => providerMappings.map(({ source, target, phonetic }) => new Provider(source, target, phonetic));

const getProviderMappings = () => window.ipcRenderer.invoke('get-provider-mappings').then(transformMappings);

const addProviderMapping = mapping => window.ipcRenderer.invoke('add-provider-mapping', mapping).then(transformMappings);

const removeProviderMappingWithSource = providerSource => window.ipcRenderer.invoke('remove-provider-mapping', providerSource).then(transformMappings);

// Message Templates
const getMessageTemplates = () => window.ipcRenderer.invoke('get-message-templates');

const addMessageTemplate = template => window.ipcRenderer.invoke('add-message-template', template);

const removeMessageTemplateWithName = templateName => window.ipcRenderer.invoke('remove-message-template', templateName);

// Settings
const getSettings = (forceLocal = false) => window.ipcRenderer.invoke('get-settings', forceLocal);

const setSettings = (path, value, forceLocal = false) => window.ipcRenderer.invoke('set-settings', path, value, forceLocal);

const setAppointmentRemindersDateVerificationDays = days => setSettings('settings.appointmentReminders.dateVerification.numberOfDays', days);

const setAppointmentRemindersDateVerificationAllowSend = allow => setSettings('settings.appointmentReminders.dateVerification.allowSendOutsideRange', allow);

const setAppointmentRemindersContactPreferencesPreferredAndSms = preferredAndSms => setSettings(
	'settings.appointmentReminders.contactPreferences.sendToPreferredAndSms',
	preferredAndSms
);

const setAppointmentRemindersContactPreferencesTextHomeIfCellNotAvailable = textHome => setSettings(
	'settings.appointmentReminders.contactPreferences.textHomeIfCellNotAvailable',
	textHome
);

const setCustomMessagesContactPreferencesPreferredAndSms = preferredAndSms => setSettings('settings.customMessages.contactPreferences.sendToPreferredAndSms', preferredAndSms);

const setCustomMessagesContactPreferencesTextHomeIfCellNotAvailable = textHome => setSettings('settings.customMessages.contactPreferences.textHomeIfCellNotAvailable', textHome);

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

const setAllowSendOutsideRange = allowSend => setSettings('settings.appointmentReminders.dateVerification.allowSendOutsideRange', allowSend);

const setNumberOfDays = days => setSettings('settings.appointmentReminders.dateVerification.numberOfDays', days);

const setEndOfRange = end => setSettings('settings.appointmentReminders.dateVerification.endOfRange', end);

const setUseBusinessDays = useBusinessDays => setSettings('settings.appointmentReminders.dateVerification.useBusinessDays', useBusinessDays);

const setSendToPreferredAndSmsForReminders = preferredAndSms => setSettings('settings.appointmentReminders.contactPreferences.sendToPreferredAndSms', preferredAndSms);

const setTextHomeIfCellNotAvailableForReminders = textHome => setSettings('settings.appointmentReminders.contactPreferences.textHomeIfCellNotAvailable', textHome);

const setSendToPreferredAndSmsForCustomMessages = preferredAndSms => setSettings('settings.customMessages.contactPreferences.sendToPreferredAndSms', preferredAndSms);

const setTextHomeIfCellNotAvailableForCustomMessages = textHome => setSettings('settings.customMessages.contactPreferences.textHomeIfCellNotAvailable', textHome);

const setDefaultPhoneReminder = messageTemplateName => setSettings('settings.appointmentReminders.defaultReminderTemplates.phone', messageTemplateName);

const setDefaultSmsReminder = messageTemplateName => setSettings('settings.appointmentReminders.defaultReminderTemplates.sms', messageTemplateName);

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
	setAppointmentRemindersContactPreferencesPreferredAndSms,
	setAppointmentRemindersContactPreferencesTextHomeIfCellNotAvailable,
	setCustomMessagesContactPreferencesPreferredAndSms,
	setCustomMessagesContactPreferencesTextHomeIfCellNotAvailable,
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
	copyLocalToNetwork,
	setAllowSendOutsideRange,
	setNumberOfDays,
	setEndOfRange,
	setUseBusinessDays,
	setSendToPreferredAndSmsForReminders,
	setTextHomeIfCellNotAvailableForReminders,
	setSendToPreferredAndSmsForCustomMessages,
	setTextHomeIfCellNotAvailableForCustomMessages,
	getDynamicValues,
	addDynamicValue,
	removeDynamicValueWithName,
	setDefaultPhoneReminder,
	setDefaultSmsReminder
};
