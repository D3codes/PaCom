import persistentStorage from './persistentStorage';

const replace = async (message, reminder) => {
    const dyanmicValues = await persistentStorage.getDynamicValues();
    let newMessage = message;

    dyanmicValues.forEach(async value => {
        if (value.fromApptList) {
            newMessage = newMessage.replace(`{{${value.name}}}`, reminder.getIn(value.pathFromReminder, ''));
        } else {
            newMessage = newMessage.replace(`{{${value.name}}}`, await replace(value.mappings.find(mapping => mapping.providerSource === reminder.getIn(['appointment', 'provider', 'source'], '')).value, reminder));
        }
    });

    return newMessage;
};

export default {
    replace
};
