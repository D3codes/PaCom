import persistentStorage from '../utilities/persistentStorage';
import Procedure from '../models/procedure';

function addUnknownProcedures(reminders) {
	const unknownProcedureSources = reminders
		.map(reminder => reminder.getIn(['appointment', 'procedure']))
		.filter(procedure => (!procedure.get('target') && procedure.get('sendToReminder') && procedure.get('sendToCustom')))
		.map(({ source }) => source);
	const distinctSources = new Set(unknownProcedureSources);
	distinctSources.forEach(source => {
		if (source) persistentStorage.addProcedureMapping(new Procedure(source, undefined, undefined, undefined, undefined, true, true));
	});
}

export default {
	addUnknownProcedures
};
