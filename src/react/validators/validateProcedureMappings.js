import persistentStorage from '../utilities/persistentStorage';
import Procedure from '../models/procedure';

function addUnknownProcedures(reminders) {
	const unknownProcedureSources = reminders
		.map(reminder => reminder.getIn(['appointment', 'procedure']))
		.filter(procedure => !procedure.get('target'))
		.map(({ source }) => source);
	const distinctSources = new Set(unknownProcedureSources);
	distinctSources.forEach(source => {
		if (source) persistentStorage.addProcedureMapping(new Procedure(source));
	});
}

export default {
	addUnknownProcedures
};
