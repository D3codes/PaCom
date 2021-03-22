import Provider from '../models/provider';
import Template from '../models/template';
import DynamicValue from '../models/dynamicValue';

// Dynamic Values
const transformDynamicValues = dynamicValues => dynamicValues.map(({
	name, fromApptList, mappings, pathFromReminder
}) => new DynamicValue(name, fromApptList, mappings, pathFromReminder));

const getDynamicValues = (includeDefault = true) => window.ipcRenderer.invoke('get-dynamic-values', includeDefault).then(transformDynamicValues);

const addDynamicValue = (value, includeDefault) => window.ipcRenderer.invoke('add-dynamic-value', value, includeDefault).then(transformDynamicValues);

const removeDynamicValueWithName = (valueName, includeDefault) => window.ipcRenderer.invoke('remove-dynamic-value', valueName, includeDefault).then(transformDynamicValues);

// Provider Mappings
const transformMappings = providerMappings => providerMappings.map(({ source, target, phonetic }) => new Provider(source, target, phonetic));

const getProviderMappings = () => window.ipcRenderer.invoke('get-provider-mappings').then(transformMappings);

const addProviderMapping = mapping => window.ipcRenderer.invoke('add-provider-mapping', mapping).then(transformMappings);

const removeProviderMappingWithSource = providerSource => window.ipcRenderer.invoke('remove-provider-mapping', providerSource).then(transformMappings);

// Message Templates
const transformTemplates = messageTemplates => messageTemplates.map(({ name, body }) => new Template(name, body));

const getMessageTemplates = () => window.ipcRenderer.invoke('get-message-templates').then(transformTemplates);

const addMessageTemplate = template => window.ipcRenderer.invoke('add-message-template', template).then(transformTemplates);

const removeMessageTemplateWithName = templateName => window.ipcRenderer.invoke('remove-message-template', templateName).then(transformTemplates);

// Settings
const getSettings = (forceLocal = false) => window.ipcRenderer.invoke('get-settings', forceLocal);

const setSettings = (path, value, forceLocal = false) => window.ipcRenderer.invoke('set-settings', path, value, forceLocal);

const setAdminAccess = hasAccess => setSettings('settings.adminAccess', hasAccess);

// Appointment Reminder Settings

const setDefaultPhoneReminder = messageTemplateName => setSettings('settings.appointmentReminders.defaultReminderTemplates.phone', messageTemplateName);

const setDefaultSmsReminder = messageTemplateName => setSettings('settings.appointmentReminders.defaultReminderTemplates.sms', messageTemplateName);

const setSendToPreferredAndSmsForReminders = preferredAndSms => setSettings('settings.appointmentReminders.contactPreferences.sendToPreferredAndSms', preferredAndSms);

const setTextHomeIfCellNotAvailableForReminders = textHome => setSettings('settings.appointmentReminders.contactPreferences.textHomeIfCellNotAvailable', textHome);

const setAllowSendOutsideRange = allowSend => setSettings('settings.appointmentReminders.dateVerification.allowSendOutsideRange', allowSend);

const setNumberOfDays = days => setSettings('settings.appointmentReminders.dateVerification.numberOfDays', days);

const setEndOfRange = end => setSettings('settings.appointmentReminders.dateVerification.endOfRange', end);

const setUseBusinessDays = useBusinessDays => setSettings('settings.appointmentReminders.dateVerification.useBusinessDays', useBusinessDays);

// Custom Message Settings
const setSendToPreferredAndSmsForCustomMessages = preferredAndSms => setSettings('settings.customMessages.contactPreferences.sendToPreferredAndSms', preferredAndSms);

const setTextHomeIfCellNotAvailableForCustomMessages = textHome => setSettings('settings.customMessages.contactPreferences.textHomeIfCellNotAvailable', textHome);

const setAllowSendOutsideRangeForCustomMessages = allowSend => setSettings('settings.customMessages.dateVerification.allowSendOutsideRange', allowSend);

const setNumberOfDaysForCustomMessages = days => setSettings('settings.customMessages.dateVerification.numberOfDays', days);

const setEndOfRangeForCustomMessage = end => setSettings('settings.customMessages.dateVerification.endOfRange', end);

const setUseBusinessDaysForCustomMessages = useBusinessDays => setSettings('settings.customMessages.dateVerification.useBusinessDays', useBusinessDays);

// Message Report Settings
const setMessageReportsAutosave = autosave => setSettings('settings.messageReports.autosaveReports', autosave);

const setMessageReportsAutosaveLocation = location => setSettings('settings.messageReports.autosaveLocation', location);

const setMessageReportsLastReport = report => setSettings('settings.messageReports.lastReport', report);

// Twilio Settings
const setTwilioSID = sid => setSettings('settings.twilio.SID', sid);

const setTwilioAuthToken = authToken => setSettings('settings.twilio.authToken', authToken);

const setTwilioPhoneNumber = phoneNumber => setSettings('settings.twilio.phoneNumber', phoneNumber);

const setTwilioSmsEndpoint = endpoint => setSettings('settings.twilio.smsEndpoint', endpoint);

const setTwilioCallEndpoint = endpoint => setSettings('settings.twilio.callEndpoint', endpoint);

// Shared Configuration Settings
const setShareConfigBehavior = behavior => setSettings('settings.shareData.behavior', behavior, true);

const setShareConfigLocation = location => setSettings('settings.shareData.location', location, true);

const copyLocalToNetwork = () => window.ipcRenderer.invoke('copy-local-to-network');

export default {
	getProviderMappings,
	addProviderMapping,
	removeProviderMappingWithSource,
	getMessageTemplates,
	addMessageTemplate,
	removeMessageTemplateWithName,
	getSettings,
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
	setDefaultSmsReminder,
	setAllowSendOutsideRangeForCustomMessages,
	setEndOfRangeForCustomMessage,
	setNumberOfDaysForCustomMessages,
	setUseBusinessDaysForCustomMessages
};
