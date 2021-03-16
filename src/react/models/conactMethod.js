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
	Home: 'Home'
};

ContactMethod.Cell = phoneNumber => new ContactMethod(phoneNumber, ContactMethod.Types.Cell);
ContactMethod.Home = phoneNumber => new ContactMethod(phoneNumber, ContactMethod.Types.Home);

export default ContactMethod;
