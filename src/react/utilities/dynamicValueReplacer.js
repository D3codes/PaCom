import persistentStorage from './persistentStorage';

const replace = async (message, reminder) => {
    const dynamicValues = await persistentStorage.getDynamicValues();
    let replacedMessage = message;

    const dynamicValuesInMessage = [...message.matchAll(/{{[^}]+}}/g)];

    await dynamicValuesInMessage.forEach(async valueInMessage => {
        const dynamicValueSource = dynamicValues.find(value => `{{${value.name}}}` === valueInMessage[0]);
        if (!dynamicValueSource) throw Error('Unknown dynamic value found in message');

        if (dynamicValueSource.fromApptList) {
            const replaceWith = reminder.getIn(dynamicValueSource.pathFromReminder, '');
            if (!replaceWith) replacedMessage = '';
            replacedMessage = replacedMessage.replace(valueInMessage, replaceWith);
        } else {
            const replaceWith = dynamicValueSource.mappings.find(mapping => mapping.providerSource === reminder.getIn(['appointment', 'provider', 'source'], ''))?.value;
            if (!replaceWith) replacedMessage = '';
            replacedMessage = replacedMessage.replace(valueInMessage, replaceWith);
        }
    });

    const allReplaced = [...replacedMessage.matchAll(/{{[^}]+}}/g)].length === 0;
    if (allReplaced) return replacedMessage;
    return replace(replacedMessage, reminder);
};

export default {
    replace
};
