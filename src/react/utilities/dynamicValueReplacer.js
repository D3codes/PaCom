import persistentStorage from './persistentStorage';

import { UnmappedDynamicValue, NonexistentDynamicValue } from '../localization/en/statusMessageText';

const getReplaceWithValueForDefaults = (dynamicValueSource, reminder, notifyBy) => {
	const pathToProviderMapping = notifyBy === 'Text' ? ['appointment', 'provider', 'target'] : ['appointment', 'provider', 'phonetic'];
	const pathToProcedureMapping = notifyBy === 'Text' ? ['appointment', 'procedure', 'target'] : ['appointment', 'procedure', 'phonetic'];
	let replaceWith;

	switch (dynamicValueSource.name) {
	case 'Provider':
		return reminder.getIn(pathToProviderMapping, '');

	case 'Procedure':
		return reminder.getIn(pathToProcedureMapping, '');

	case 'Patient Name':
		replaceWith = reminder.getIn(dynamicValueSource.pathFromReminder, '');
		[, replaceWith] = replaceWith.split(', ');
		return replaceWith;

	default:
		return reminder.getIn(dynamicValueSource.pathFromReminder, '');
	}
};

const replace = async (message, reminder, notifyBy) => {
	const dynamicValues = await persistentStorage.getDynamicValues();
	let replacedMessage = message;

	const dynamicValuesInMessage = [...message.matchAll(/{{[^}]+}}/g)];
	dynamicValuesInMessage.forEach(valueInMessage => {
		const dynamicValueSource = dynamicValues.find(value => `{{${value.name}}}` === valueInMessage[0]);
		if (!dynamicValueSource) {
			reminder.setFailedStatus();
			reminder.setStatusMessage(`${NonexistentDynamicValue}${valueInMessage[0]}`);
			replacedMessage = '';
		} else if (dynamicValueSource.fromApptList) {
			const replaceWith = getReplaceWithValueForDefaults(dynamicValueSource, reminder, notifyBy);
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
