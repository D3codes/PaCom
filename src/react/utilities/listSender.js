import twilio from './twilioClient';
import dynamicValueReplacer from './dynamicValueReplacer';
import persistentStorage from './persistentStorage';
import reportExporter from './reportExporter';
import groupReminders from './reminderGrouper';

import Reminder from '../models/reminder';
import Patient from '../models/patient';
import ContactMethod from '../models/conactMethod';

import {
	SmsSentToHome, MissingPhoneNumber, PreferredAndSms, TwilioError, NoMessageToSend, BundledCall, ProviderSkipped, ProcedureSkipped
} from '../localization/en/statusMessageText';

const SLEEP_DURATION = 500;

let defaultPhoneReminder = '';
let defaultSmsReminder = '';
let sendToPreferredContactMethodAndSms = false;
let sendSmsToHomeIfNoCell = false;
let autoSave = false;
let autoSavePath = '';
let complete = null;
let messageTemplates = [];
let calls = [];

const setDefaults = () => {
	defaultPhoneReminder = '';
	defaultSmsReminder = '';
	sendToPreferredContactMethodAndSms = false;
	sendSmsToHomeIfNoCell = false;
	autoSave = false;
	autoSavePath = '';
	complete = null;
	calls = [];
	messageTemplates = [];
};

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
		const call = calls[i];

		if (!call.number) {
			call.reminders.forEach(reminder => {
				reminder.setFailedStatus();
				reminder.appendStatusMessage(MissingPhoneNumber);

				if (onUpdate) {
					onUpdate([...reminders]);
				}
			});

			// eslint-disable-next-line no-continue
			continue;
		}

		twilio.sendCall(call.number, call.message).then(sentSuccessfully => {
			// loop through all reminders for number and update statuses
			call.reminders.forEach(reminder => {
				if (sentSuccessfully) {
					reminder.setSentStatus();
					if (call.reminders.length > 1) reminder.appendStatusMessage(BundledCall);
				} else {
					reminder.setFailedStatus();
					reminder.setStatusMessage(TwilioError);
				}
				if (onUpdate) {
					onUpdate([...reminders]);
				}
			});
		});

		// Tactical sleep
		// eslint-disable-next-line no-await-in-loop
		await new Promise(resolve => setTimeout(() => resolve(null), SLEEP_DURATION));
	}
};

const getReminderTemplate = (reminder, notifyBy) => {
	// procedure mapping phone reminder override
	const phoneReminder = reminder.getIn(['appointment', 'procedure', 'phoneReminder'], null);
	if (notifyBy !== Patient.NotifyBy.Text && phoneReminder && phoneReminder !== 'Default') return messageTemplates.find(t => t.name === phoneReminder)?.body || '';

	// procedure mapping sms reminder override
	const smsReminder = reminder.getIn(['appointment', 'procedure', 'smsReminder'], null);
	if (notifyBy === Patient.NotifyBy.Text && smsReminder && smsReminder !== 'Default') return messageTemplates.find(t => t.name === smsReminder)?.body || '';

	// default reminder
	return notifyBy === Patient.NotifyBy.Text ? defaultSmsReminder : defaultPhoneReminder;
};

const handleLastReminder = (onUpdate, reminders) => {
	sendCalls(onUpdate, reminders).then(() => {
		// Export Message Report Automatically, if enabled
		if (autoSave) {
			reportExporter.exportReport(groupReminders.byProviderAndDate(reminders), autoSavePath);
		}

		complete();
	});
};

const sendToList = async (reminders, onUpdate = null, proceduresToSkip, providersToSkip, message = '', forceText = false) => {
	if (!reminders || reminders.length <= 0) {
		complete();
		return;
	}

	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < reminders.length; i++) {
		const reminder = reminders[i];

		if (onUpdate) {
			onUpdate([...reminders]);
		}

		if (reminder.status === Reminder.Status.Failed) {
			// If this is the last reminder, send bundled calls
			if (i === reminders.length - 1 && !forceText) {
				handleLastReminder(onUpdate, reminders);
			}

			// eslint-disable-next-line no-continue
			continue;
		}

		if (proceduresToSkip.includes(reminder.getIn(['appointment', 'procedure', 'source'], null))) {
			reminder.setSkippedStatus();
			reminder.setStatusMessage(ProcedureSkipped);

			// If this is the last reminder, send bundled calls
			if (i === reminders.length - 1 && !forceText) {
				handleLastReminder(onUpdate, reminders);
			}

			// eslint-disable-next-line no-continue
			continue;
		}

		if (providersToSkip.includes(reminder.getIn(['appointment', 'provider', 'source'], null))) {
			reminder.setSkippedStatus();
			reminder.setStatusMessage(ProviderSkipped);

			// If this is the last reminder, send bundled calls
			if (i === reminders.length - 1 && !forceText) {
				handleLastReminder(onUpdate, reminders);
			}

			// eslint-disable-next-line no-continue
			continue;
		}

		reminder.setSendingStatus();
		if (onUpdate) {
			onUpdate([...reminders]);
		}

		// Tactical sleep
		// eslint-disable-next-line no-await-in-loop
		await new Promise(resolve => setTimeout(() => resolve(null), SLEEP_DURATION));

		const notifyBy = forceText ? Patient.NotifyBy.Text : reminder.getIn(['patient', 'preferredContactMethod'], null);
		const messageToSend = message || getReminderTemplate(reminder, notifyBy);

		let contactNumber = reminder.get('patient').getPhoneNumberByType(notifyBy === Patient.NotifyBy.Phone ? ContactMethod.Types.Home : ContactMethod.Types.Cell);
		if (!contactNumber && notifyBy === Patient.NotifyBy.Text && sendSmsToHomeIfNoCell) {
			contactNumber = reminder.get('patient').getPhoneNumberByType(ContactMethod.Types.Home);
			reminder.appendStatusMessage(SmsSentToHome);
		}
		if (!contactNumber && (!sendToPreferredContactMethodAndSms || notifyBy === Patient.NotifyBy.Text)) {
			reminder.setFailedStatus();
			reminder.setStatusMessage(MissingPhoneNumber);
			// eslint-disable-next-line no-continue
			continue;
		}

		// eslint-disable-next-line no-await-in-loop, no-loop-func
		await dynamicValueReplacer.replace(messageToSend, reminder, notifyBy).then(async replacedMessage => {
			if (replacedMessage && notifyBy === Patient.NotifyBy.Text) {
				twilio.sendSMS(contactNumber, replacedMessage).then(sentSuccessfully => {
					if (!forceText) {
						if (sentSuccessfully) reminder.setSentStatus();
						else {
							reminder.setFailedStatus();
							reminder.setStatusMessage(TwilioError);
						}
					}

					// If this is the last reminder, send bundled calls
					if (i === reminders.length - 1 && !forceText) {
						handleLastReminder(onUpdate, reminders);
					}
				});
			} else if (replacedMessage) {
				callBundler(contactNumber, replacedMessage, reminder);
				if (sendToPreferredContactMethodAndSms) {
					reminder.appendStatusMessage(PreferredAndSms);
					await sendToList([reminder], null, proceduresToSkip, providersToSkip, message, true);
				}

				// If this is the last reminder, send bundled calls
				if (i === reminders.length - 1 && !forceText) {
					handleLastReminder(onUpdate, reminders);
				}
			} else {
				reminder.setFailedStatus();
				reminder.appendStatusMessage(NoMessageToSend);

				// If this is the last reminder, send bundled calls
				if (i === reminders.length - 1 && !forceText) {
					handleLastReminder(onUpdate, reminders);
				}
			}
		});
	}
};

const sendCustomMessage = (reminders, message, onUpdate, onComplete, procedureMappings, providerMappings) => {
	setDefaults();
	complete = onComplete;
	persistentStorage.getSettings().then(settings => {
		// Get Contact Preferences
		sendToPreferredContactMethodAndSms = settings.customMessages.contactPreferences.sendToPreferredAndSms;
		sendSmsToHomeIfNoCell = settings.customMessages.contactPreferences.textHomeIfCellNotAvailable;

		// Get AutoSave Settings
		autoSave = settings.messageReports.autosaveReports;
		autoSavePath = settings.messageReports.autosaveLocation;

		const proceduresToSkip = procedureMappings.filter(x => !x.sendToCustom).map(x => x.source);
		const providersToSkip = providerMappings.filter(x => !x.sendToCustom).map(x => x.source);
		sendToList(reminders, onUpdate, proceduresToSkip, providersToSkip, message);
	});
};

const sendAppointmentReminders = (reminders, onUpdate, onComplete, procedureMappings, providerMappings) => {
	setDefaults();
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
			messageTemplates = templates;

			const proceduresToSkip = procedureMappings.filter(x => !x.sendToReminder).map(x => x.source);
			const providersToSkip = providerMappings.filter(x => !x.sendToReminder).map(x => x.source);
			sendToList(reminders, onUpdate, proceduresToSkip, providersToSkip);
		});
	});
};

export default {
	sendAppointmentReminders,
	sendCustomMessage
};
