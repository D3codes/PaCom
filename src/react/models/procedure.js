import Model from './model';

class Procedure extends Model {
	constructor(source, target, phonetic, phoneReminder, smsReminder, sendToReminder, sendToCustom) {
		super();
		this.source = source;
		this.target = target;
		this.phonetic = phonetic;
		this.phoneReminder = phoneReminder;
		this.smsReminder = smsReminder;
		this.sendToReminder = sendToReminder;
		this.sendToCustom = sendToCustom;
	}
}

export default Procedure;
