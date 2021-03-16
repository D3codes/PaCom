import Model from './model';

class DynamicValue extends Model {
	constructor(name, fromApptList, mappings) {
		super();
		this.name = name;
		this.fromApptList = fromApptList;
		this.mappings = mappings;
	}
}

export default DynamicValue;
