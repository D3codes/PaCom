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

	getPhoneNumberByType(type) {
		const contactMethods = this.get('contactMethods');
		const contactMethod = contactMethods && contactMethods.find((cm) => cm.type === type);
		return contactMethod ? contactMethod.phoneNumber : null;
	}
}

export default Patient;
