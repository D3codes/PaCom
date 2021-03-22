import twilio from './twilioClient';
import dynamicValueReplacer from './dynamicValueReplacer';
import persistentStorage from './persistentStorage';

let defaultPhoneReminder = '';
let defaultSmsReminder = '';

const sendToList = async (reminders, message = '') => {
    reminders.forEach(reminder => {
        reminder.setSendingStatus();

        const notifyBy = reminder.getIn(['patient', 'preferredContactMethod'], null);
        const messageToSend = message || notifyBy === 'Text' ? defaultSmsReminder : defaultPhoneReminder;

        const contactNumber = reminder.get('patient').getPhoneNumberByType(notifyBy === 'Phone' ? 'Home' : 'Cell');
        dynamicValueReplacer.replace(messageToSend, reminder).then(replacedMessage => {
            if (notifyBy === 'Text') {
                twilio.sendSMS(contactNumber, replacedMessage);
            } else {
                twilio.sendCall(contactNumber, replacedMessage);
            }
        });

        reminder.setSentStatus();
    });
};

const sendAppointmentReminders = reminders => {
    persistentStorage.getSettings().then(settings => {
        const defaultPhone = settings.appointmentReminders.defaultReminderTemplates.phone;
        const defaultSms = settings.appointmentReminders.defaultReminderTemplates.sms;

        persistentStorage.getMessageTemplates().then(templates => {
            defaultSmsReminder = templates.find(template => template.name === defaultSms).body;
            defaultPhoneReminder = templates.find(template => template.name === defaultPhone).body;

            sendToList(reminders);
        });
    });
};

export default {
    sendToList,
    sendAppointmentReminders
};
