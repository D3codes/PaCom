import Model from './model';

class ContactMethod extends Model {
	constructor(phoneNumber, type) {
		super();
		this.phoneNumber = phoneNumber;
		this.type = type;
	}
}

export default ContactMethod;
