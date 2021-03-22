import persistentStorage from './persistentStorage';

import { UnmappedDynamicValue, NonexistentDynamicValue } from '../localization/en/statusMessageText';

const replace = async (message, reminder) => {
    const dynamicValues = await persistentStorage.getDynamicValues();
    let replacedMessage = message;

    const dynamicValuesInMessage = [...message.matchAll(/{{[^}]+}}/g)];

    await dynamicValuesInMessage.forEach(async valueInMessage => {
        const dynamicValueSource = dynamicValues.find(value => `{{${value.name}}}` === valueInMessage[0]);
        if (!dynamicValueSource) {
            reminder.setFailedStatus();
            reminder.setStatusMessage(`${NonexistentDynamicValue}${valueInMessage[0]}`);
            replacedMessage = '';
        } else if (dynamicValueSource.fromApptList) {
            const replaceWith = reminder.getIn(dynamicValueSource.pathFromReminder, '');
            if (!replaceWith) {
                replacedMessage = '';
                reminder.setFailedStatus();
                reminder.setStatusMessage(`${UnmappedDynamicValue}${valueInMessage[0]}`);
            }
            replacedMessage = replacedMessage.replace(valueInMessage, replaceWith);
        } else {
            const replaceWith = dynamicValueSource.mappings.find(mapping => mapping.providerSource === reminder.getIn(['appointment', 'provider', 'source'], ''))?.value;
            if (!replaceWith) {
                replacedMessage = '';
                reminder.setFailedStatus();
                reminder.setStatusMessage(`${UnmappedDynamicValue}${valueInMessage[0]}`);
            }
            replacedMessage = replacedMessage.replace(valueInMessage, replaceWith);
        }
    });

    // Custom dynamic values can contain report dynamic values
    // Recurse if necessary
    const allReplaced = [...replacedMessage.matchAll(/{{[^}]+}}/g)].length === 0;
    if (allReplaced) return replacedMessage;
    return replace(replacedMessage, reminder);
};

export default {
    replace
};
