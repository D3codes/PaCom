import twilio from './twilioClient';
import dynamicValueReplacer from './dynamicValueReplacer';
import persistentStorage from './persistentStorage';
import reportExporter from './reportExporter';

import {
	SmsSentToHome, MissingPhoneNumber, PreferredAndSms, TwilioError
} from '../localization/en/statusMessageText';

const SLEEP_DURATION = 500;

let defaultPhoneReminder = '';
let defaultSmsReminder = '';
let sendToPreferredContactMethodAndSms = false;
let sendSmsToHomeIfNoCell = false;
let autoSave = false;
let autoSavePath = '';
let complete = null;

let calls = [];
const callBundler = (number, message, reminder) => {
	// Check for existing call to number
	let call = calls.find(c => c.number === number);
	if (call) {
		// If existing call is present, append message body
		// to existing body and push reminder to list
		call.message = `${call.message} ${message}`;
		call.reminders.push(reminder);
	} else {
		call = { number, message, reminders: [reminder] };
	}

	// Remove existing call from list and replace with updated call
	calls = calls.filter(c => c.number !== number);
	calls.push(call);
};

const sendCalls = async (onUpdate, reminders) => {
	// send all calls
	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < calls.length; i++) {
		// Tactical sleep
		// eslint-disable-next-line no-await-in-loop
		await new Promise(resolve => setTimeout(() => resolve(null), SLEEP_DURATION));

		const call = calls[i];
		twilio.sendCall(call.number, call.message).then(sentSuccessfully => {
			// loop through all reminders for number and update statuses
			call.reminders.forEach(reminder => {
				if (sentSuccessfully) reminder.setSentStatus();
				else {
					reminder.setFailedStatus();
					reminder.setStatusMessage(TwilioError);
				}
				if (onUpdate) {
					onUpdate([...reminders]);
				}
			});
		});
	}
};

const groupRemindersByProviderAndDate = reminders => reminders.reduce((remindersByProviderAndDate, reminder) => {
	const providerDateKey = `${reminder.getIn(['appointment', 'provider', 'target'], 'Unmapped Provider(s)')} - ${reminder.getIn(['appointment', 'date'])}`;
	const updatedRemindersByProviderAndDate = { ...remindersByProviderAndDate };
	if (updatedRemindersByProviderAndDate[providerDateKey]) {
		updatedRemindersByProviderAndDate[providerDateKey].push(reminder);
	} else {
		updatedRemindersByProviderAndDate[providerDateKey] = [reminder];
	}
	return updatedRemindersByProviderAndDate;
}, {});

const sendToList = async (reminders, onUpdate = null, message = '', forceText = false) => {
	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < reminders.length; i++) {
		const reminder = reminders[i];
		reminder.setSendingStatus();
		if (onUpdate) {
			onUpdate([...reminders]);
		}

		// Tactical sleep
		// eslint-disable-next-line no-await-in-loop
		await new Promise(resolve => setTimeout(() => resolve(null), SLEEP_DURATION));

		const notifyBy = forceText ? 'Text' : reminder.getIn(['patient', 'preferredContactMethod'], null);
		const messageToSend = message || notifyBy === 'Text' ? defaultSmsReminder : defaultPhoneReminder;

		let contactNumber = reminder.get('patient').getPhoneNumberByType(notifyBy === 'Phone' ? 'Home' : 'Cell');
		if (!contactNumber && notifyBy === 'Text' && sendSmsToHomeIfNoCell) {
			contactNumber = reminder.get('patient').getPhoneNumberByType('Home');
			reminder.appendStatusMessage(SmsSentToHome);
		}
		if (!contactNumber) {
			reminder.setFailedStatus();
			reminder.setStatusMessage(MissingPhoneNumber);
			// eslint-disable-next-line no-continue
			continue;
		}

		// eslint-disable-next-line no-loop-func
		dynamicValueReplacer.replace(messageToSend, reminder).then(async replacedMessage => {
			if (replacedMessage && notifyBy === 'Text') {
				twilio.sendSMS(contactNumber, replacedMessage).then(sentSuccessfully => {
					if (!forceText) {
						if (sentSuccessfully) reminder.setSentStatus();
						else {
							reminder.setFailedStatus();
							reminder.setStatusMessage(TwilioError);
						}
					}
				});
			} else if (replacedMessage) {
				callBundler(contactNumber, replacedMessage, reminder);
				if (sendToPreferredContactMethodAndSms) {
					reminder.appendStatusMessage(PreferredAndSms);
					await sendToList([reminder], null, message, true);
				}
			}

			// If this is the last reminder, send bundled calls
			if (i === reminders.length - 1 && !forceText) {
				sendCalls(onUpdate, reminders).then(() => {
					// Export Message Report Automatically, if enabled
					if (autoSave) {
						reportExporter.exportReport(groupRemindersByProviderAndDate(reminders), autoSavePath);
					}

					complete();
				});
			}

			if (onUpdate) {
				onUpdate([...reminders]);
			}
		});
	}
};

const sendCustomMessage = (reminders, message, onUpdate, onComplete) => {
	complete = onComplete;
	persistentStorage.getSettings().then(settings => {
		// Get Contact Preferences
		sendToPreferredContactMethodAndSms = settings.customMessages.contactPreferences.sendToPreferredAndSms;
		sendSmsToHomeIfNoCell = settings.customMessages.contactPreferences.textHomeIfCellNotAvailable;

		// Get AutoSave Settings
		autoSave = settings.messageReports.autosaveReports;
		autoSavePath = settings.messageReports.autosaveLocation;

		sendToList(reminders, onUpdate, message);
	});
};

const sendAppointmentReminders = (reminders, onUpdate, onComplete) => {
	complete = onComplete;
	persistentStorage.getSettings().then(settings => {
		// Get Names of Default Call and Message Templates from Settings
		const defaultPhone = settings.appointmentReminders.defaultReminderTemplates.phone;
		const defaultSms = settings.appointmentReminders.defaultReminderTemplates.sms;

		// Get Contact Preferences
		sendToPreferredContactMethodAndSms = settings.appointmentReminders.contactPreferences.sendToPreferredAndSms;
		sendSmsToHomeIfNoCell = settings.appointmentReminders.contactPreferences.textHomeIfCellNotAvailable;

		// Get AutoSave Settings
		autoSave = settings.messageReports.autosaveReports;
		autoSavePath = settings.messageReports.autosaveLocation;

		persistentStorage.getMessageTemplates().then(templates => {
			// Set Default Messages Templates
			defaultSmsReminder = templates.find(template => template.name === defaultSms).body;
			defaultPhoneReminder = templates.find(template => template.name === defaultPhone).body;

			sendToList(reminders, onUpdate);
		});
	});
};

export default {
	sendAppointmentReminders,
	sendCustomMessage
};
