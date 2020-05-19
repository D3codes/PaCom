// Provider Mappings
const getProviderMappings = () => {
	window.ipcRenderer.send('get-provider-mappings');
	return new Promise((resolve, reject) => {
		window.ipcRenderer.on('provider-mappings', (event, mappings) => {
			if (mappings) {
				resolve(mappings);
			} else {
				reject();
			}
		});
	});
};

const addProviderMapping = (provider) => {
	window.ipcRenderer.send('add-provider-mapping', provider);
};

const removeProviderMappingWithSource = (providerSource) => {
	window.ipcRenderer.send('remove-provider-mapping', providerSource);
};

// Message Templates
const getMessageTemplates = () => {
	window.ipcRenderer.send('get-message-templates');
	return new Promise((resolve, reject) => {
		window.ipcRenderer.on('message-templates', (event, templates) => {
			if (templates) {
				resolve(templates);
			} else {
				reject();
			}
		});
	});
};

const addMessageTemplate = (template) => {
	window.ipcRenderer.send('add-message-template', template);
};

const removeMessageTemplateWithName = (templateName) => {
	window.ipcRenderer.send('remove-message-template', templateName);
};

// Settings
const getSettings = () => {
	window.ipcRenderer.send('get-settings');
	return new Promise((resolve, reject) => {
		window.ipcRenderer.on('settings', (event, settings) => {
			if (settings) {
				resolve(settings);
			} else {
				reject();
			}
		});
	});
};

const setSettings = (path, value) => {
	window.ipcRenderer.send('set-settings', path, value);
};

const setAppointmentRemindersDateVerificationDays = (days) => {
	setSettings('settings.appointmentReminders.dateVerification.numberOfDays', days);
};

const setAppointmentRemindersDateVerificationAllowSend = (allow) => {
	setSettings('settings.appointmentReminders.dateVerification.allowSendOutsideRange', allow);
};

const setAppointmentRemindersNotificationMethodPreferredAndSms = (preferredAndSms) => {
	setSettings('settings.appointmentReminders.notificationMethod.sendToPreferredAndSms', preferredAndSms);
};

const setAppointmentRemindersNotificationMethodTextHomeIfCellNotAvailable = (textHome) => {
	setSettings('settings.appointmentReminders.notificationMethod.textHomeIfCellNotAvailable', textHome);
};

const setCustomMessagesNotificationMethodPreferredAndSms = (preferredAndSms) => {
	setSettings('settings.customMessages.notificationMethod.sendToPreferredAndSms', preferredAndSms);
};

const setCustomMessagesNotificationMethodTextHomeIfCellNotAvailable = (textHome) => {
	setSettings('settings.customMessages.notificationMethod.textHomeIfCellNotAvailable', textHome);
};

const setMessageReportsAutosave = (autosave) => {
	setSettings('settings.messageReports.autosaveReports', autosave);
};

const setMessageReportsAutosaveLocation = (location) => {
	setSettings('settings.messageReports.autosaveLocation', location);
};

const setMessageReportsLastReport = (report) => {
	setSettings('settings.messageReports.lastReport', report);
};

const setTwilioSID = (sid) => {
	setSettings('settings.twilio.SID', sid);
};

const setTwilioAuthToken = (authToken) => {
	setSettings('settings.twilio.authToken', authToken);
};

const setTwilioPhoneNumber = (phoneNumber) => {
	setSettings('settings.twilio.phoneNumber', phoneNumber);
};

const setShareDataBehavior = (behavior) => {
	setSettings('settings.shareData.behavior', behavior);
};

const setShareDataLocation = (location) => {
	setSettings('settings.shareData.location', location);
};

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
	setTwilioPhoneNumber,
	setShareDataBehavior,
	setShareDataLocation
};
