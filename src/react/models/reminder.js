import Model from './model';

class Reminder extends Model {
	constructor(patient, appointment) {
		super();
		this.patient = patient;
		this.appointment = appointment;
		this.status = 'Pending...';
	}

	getPatientPhoneNumberByType(type) {
		const contactMethods = this.getIn(['patient', 'contactMethods']);
		const contactMethod = contactMethods && contactMethods.find((cm) => cm.type === type);
		return contactMethod ? contactMethod.phoneNumber : null;
	}
}

export default Reminder;
