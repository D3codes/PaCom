class Reminder {
	constructor(patient, appointment) {
		this.patient = patient;
		this.appointment = appointment;
		this.status = 'Pending...';
	}

	getPatientPhoneNumberByType(type) {
		const contactMethod = this.patient && this.patient.contactMethods && this.patient.contactMethods.find((cm) => cm.type === type);
		return contactMethod ? contactMethod.phoneNumber : null;
	}
}

module.exports = Reminder;
