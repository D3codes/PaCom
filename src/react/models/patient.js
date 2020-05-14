module.exports = class Patient {
	constructor(accountNumber, name, contactMethods, preferredContactMethod, dateOfBirth) {
		this.accountNumber = accountNumber;
		this.name = name;
		this.contactMethods = contactMethods;
		this.preferredContactMethod = preferredContactMethod;
		this.dateOfBirth = dateOfBirth;
	}
};
