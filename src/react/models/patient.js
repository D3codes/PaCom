import Model from './model';

class Patient extends Model {
	constructor(accountNumber, name, contactMethods, preferredContactMethod, dateOfBirth) {
		super();
		this.accountNumber = accountNumber;
		this.name = name;
		this.contactMethods = contactMethods;
		this.preferredContactMethod = preferredContactMethod;
		this.dateOfBirth = dateOfBirth;
	}
}

export default Patient;
