import twilio from './twilioClient';
import dynamicValueReplacer from './dynamicValueReplacer';
import persistentStorage from './persistentStorage';

let defaultPhoneReminder = '';
let defaultSmsReminder = '';
let sendToPreferredContactMethodAndSms = false;
let sendSmsToHomeIfNoCell = false;

/*
 For Each Appointment {
    swap dynamic values
    select preferred contact number
    group phone calls to the same number and send as one call
    optional settings:
        send to sms as well as preferred contact method
        send sms to home phone if cell not available
 }
*/

const sendToList = async (reminders, message = '') => {
    reminders.forEach(reminder => {
        reminder.setSendingStatus();

        const notifyBy = reminder.getIn(['patient', 'preferredContactMethod'], null);
        const messageToSend = message || notifyBy === 'Text' ? defaultSmsReminder : defaultPhoneReminder;

        let contactNumber = reminder.get('patient').getPhoneNumberByType(notifyBy === 'Phone' ? 'Home' : 'Cell');
        if (!contactNumber && notifyBy === 'Text' && sendSmsToHomeIfNoCell) {
            contactNumber = reminder.get('patient').getPhoneNumberByType('Home');
        }
        if (!contactNumber) {
            throw Error('no number');
        }

        dynamicValueReplacer.replace(messageToSend, reminder).then(replacedMessage => {
            if (notifyBy === 'Text') {
                twilio.sendSMS(contactNumber, replacedMessage);
            } else {
                twilio.sendCall(contactNumber, replacedMessage);
                if (sendToPreferredContactMethodAndSms) {
                    const resendReminder = reminder;
                    resendReminder.patient.preferredContactMethod = 'Text';
                    sendToList([resendReminder]);
                }
            }
        });

        reminder.setSentStatus();
    });
};

const sendCustomMessage = (reminders, message) => {
    persistentStorage.getSettings().then(settings => {
        sendToPreferredContactMethodAndSms = settings.customMessages.contactPreferences.sendToPreferredAndSms;
        sendSmsToHomeIfNoCell = settings.customMessages.contactPreferences.textHomeIfCellNotAvailable;

        sendToList(reminders, message);
    });
};

const sendAppointmentReminders = reminders => {
    persistentStorage.getSettings().then(settings => {
        const defaultPhone = settings.appointmentReminders.defaultReminderTemplates.phone;
        const defaultSms = settings.appointmentReminders.defaultReminderTemplates.sms;
        sendToPreferredContactMethodAndSms = settings.appointmentReminders.contactPreferences.sendToPreferredAndSms;
        sendSmsToHomeIfNoCell = settings.appointmentReminders.contactPreferences.textHomeIfCellNotAvailable;

        persistentStorage.getMessageTemplates().then(templates => {
            defaultSmsReminder = templates.find(template => template.name === defaultSms).body;
            defaultPhoneReminder = templates.find(template => template.name === defaultPhone).body;

            sendToList(reminders);
        });
    });
};

export default {
    sendAppointmentReminders,
    sendCustomMessage
};
