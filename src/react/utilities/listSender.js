import twilio from './twilioClient';
import dynamicValueReplacer from './dynamicValueReplacer';
import persistentStorage from './persistentStorage';

let defaultPhoneReminder = '';
let defaultSmsReminder = '';
let sendToPreferredContactMethodAndSms = false;
let sendSmsToHomeIfNoCell = false;

let calls = [];
const callBundler = (number, message, reminder) => {
    let call = calls.find(c => c.number === number);
    if (call) {
        call.message = `${call.message} ${message}`;
        call.reminders.push(reminder);
    } else {
        call = { number, message, reminders: [reminder] };
    }

    calls = calls.filter(c => c.number !== number);
    calls.push(call);
};

const sendCalls = () => {
    calls.forEach(call => {
        twilio.sendCall(call.number, call.message);
        call.reminders.forEach(reminder => {
            reminder.setSentStatus();
        });
    });
};

const sendToList = async (reminders, onUpdate = null, message = '', forceText = false) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < reminders.length; i++) {
        const reminder = reminders[i];
        reminder.setSendingStatus();
        if (onUpdate) {
            onUpdate(reminders);
        }

        // Tactical sleep
		// eslint-disable-next-line no-await-in-loop
		await new Promise(resolve => setTimeout(() => resolve(null), 250));

        const notifyBy = forceText ? 'Text' : reminder.getIn(['patient', 'preferredContactMethod'], null);
        const messageToSend = message || notifyBy === 'Text' ? defaultSmsReminder : defaultPhoneReminder;

        let contactNumber = reminder.get('patient').getPhoneNumberByType(notifyBy === 'Phone' ? 'Home' : 'Cell');
        if (!contactNumber && notifyBy === 'Text' && sendSmsToHomeIfNoCell) {
            contactNumber = reminder.get('patient').getPhoneNumberByType('Home');
            reminder.setMessage('SMS sent to home phone');
        }
        if (!contactNumber) {
            reminder.setFailedStatus();
            reminder.setMessage('No phone number');
            // eslint-disable-next-line no-continue
            continue;
        }

        // eslint-disable-next-line no-loop-func
        dynamicValueReplacer.replace(messageToSend, reminder).then(replacedMessage => {
            if (!replacedMessage) {
                reminder.setFailedStatus();
                reminder.setMessage('Unmapped dynamic values');
            } else if (notifyBy === 'Text') {
                twilio.sendSMS(contactNumber, replacedMessage);
                reminder.setSentStatus();
            } else {
                callBundler(contactNumber, replacedMessage, reminder);
                if (sendToPreferredContactMethodAndSms) {
                    reminder.setMessage('Sent to SMS as well as preferred contact method');
                    sendToList([reminder], null, '', true);
                }
            }

            if (i === reminders.length - 1 && !forceText) {
                sendCalls();
            }

            if (onUpdate) {
                onUpdate(reminders);
            }
        });
    }
};

const sendCustomMessage = (reminders, message, onUpdate) => {
    persistentStorage.getSettings().then(settings => {
        sendToPreferredContactMethodAndSms = settings.customMessages.contactPreferences.sendToPreferredAndSms;
        sendSmsToHomeIfNoCell = settings.customMessages.contactPreferences.textHomeIfCellNotAvailable;

        sendToList(reminders, onUpdate, message);
    });
};

const sendAppointmentReminders = (reminders, onUpdate) => {
    persistentStorage.getSettings().then(settings => {
        const defaultPhone = settings.appointmentReminders.defaultReminderTemplates.phone;
        const defaultSms = settings.appointmentReminders.defaultReminderTemplates.sms;
        sendToPreferredContactMethodAndSms = settings.appointmentReminders.contactPreferences.sendToPreferredAndSms;
        sendSmsToHomeIfNoCell = settings.appointmentReminders.contactPreferences.textHomeIfCellNotAvailable;

        persistentStorage.getMessageTemplates().then(templates => {
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
