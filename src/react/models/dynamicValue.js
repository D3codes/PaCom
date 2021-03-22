import Model from './model';

class DynamicValue extends Model {
	constructor(name, fromApptList, mappings, pathFromReminder) {
		super();
		this.name = name;
		this.fromApptList = fromApptList;
		this.mappings = mappings;
		this.pathFromReminder = pathFromReminder;
	}
}

export default DynamicValue;
