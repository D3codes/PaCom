import Model from './model';

class Procedure extends Model {
	constructor(source, target, phonetic, phoneReminder, smsReminder) {
		super();
		this.source = source;
		this.target = target;
		this.phonetic = phonetic;
		this.phoneReminder = phoneReminder;
		this.smsReminder = smsReminder;
	}
}

export default Procedure;
