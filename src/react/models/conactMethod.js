import Model from './model';

class ContactMethod extends Model {
	constructor(phoneNumber, type) {
		super();
		this.phoneNumber = phoneNumber;
		this.type = type;
	}
}

ContactMethod.Types = {
	Cell: 'Cell',
	Home: 'Home',
	Work: 'Work'
};

ContactMethod.Cell = (phoneNumber) => new ContactMethod(phoneNumber, ContactMethod.Types.Cell);
ContactMethod.Home = (phoneNumber) => new ContactMethod(phoneNumber, ContactMethod.Types.Home);
ContactMethod.Work = (phoneNumber) => new ContactMethod(phoneNumber, ContactMethod.Types.Work);

export default ContactMethod;
