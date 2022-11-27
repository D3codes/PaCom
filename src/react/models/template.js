import Model from './model';

class Template extends Model {
	constructor(name, body, smsOnly) {
		super();
		this.name = name;
		this.body = body;
		this.smsOnly = smsOnly;
	}
}

export default Template;
