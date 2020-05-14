module.exports = class Patient {
	constructor(name, contactMethods, preferredContactMethod) {
		this.name = name;
		this.contactMethods = contactMethods;
		this.preferredContactMethod = preferredContactMethod;
	}
};
