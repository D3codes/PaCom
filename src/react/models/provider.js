import Model from './model';

class Provider extends Model {
	constructor(source, target, phonetic, sendToReminder, sendToCustom) {
		super();
		this.source = source;
		this.target = target;
		this.phonetic = phonetic;
		this.sendToReminder = sendToReminder;
		this.sendToCustom = sendToCustom;
	}
}

export default Provider;
