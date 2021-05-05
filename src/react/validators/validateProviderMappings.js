import persistentStorage from '../utilities/persistentStorage';
import Provider from '../models/provider';
import dialogController from '../utilities/dialogController';
import {
	ErrorInAppointmentListTitle, ErrorInAppointmentListMessage,
	UnmappedProvidersWarningTitle, UnmappedProvidersWarningMessage
} from '../localization/en/dialogText';

async function validateProviderMappings(reminders) {
	if (reminders.some(reminder => reminder.status === 'Failed')) {
		return dialogController.showWarning(ErrorInAppointmentListTitle, ErrorInAppointmentListMessage);
	}
	if (reminders.some(reminder => !reminder.getIn(['appointment', 'provider', 'target']))) {
		return dialogController.showWarning(UnmappedProvidersWarningTitle, UnmappedProvidersWarningMessage);
	}
	return null;
}

function addUnknownProviders(reminders) {
	const unknownProviderSources = reminders
		.map(reminder => reminder.getIn(['appointment', 'provider']))
		.filter(provider => (!provider.get('target') && provider.get('sendToReminder') && provider.get('sendToCustom')))
		.map(({ source }) => source);
	const distinctSources = new Set(unknownProviderSources);
	distinctSources.forEach(source => {
		if (source) persistentStorage.addProviderMapping(new Provider(source, undefined, undefined, true, true));
	});
}

export default {
	validateProviderMappings,
	addUnknownProviders
};
