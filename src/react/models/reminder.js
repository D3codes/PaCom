import Model from './model';

class Reminder extends Model {
	constructor(patient, appointment) {
		super();
		this.patient = patient;
		this.appointment = appointment;
		this.status = Reminder.Status.Pending;
	}

	getPatientPhoneNumberByType(type) {
		const contactMethods = this.getIn(['patient', 'contactMethods']);
		const contactMethod = contactMethods && contactMethods.find((cm) => cm.type === type);
		return contactMethod ? contactMethod.phoneNumber : null;
	}

	setPendingStatus() {
		this.status = Reminder.Status.Pending;
	}

	setSentStatus() {
		this.status = Reminder.Status.Sent;
	}

	setCanceledStatus() {
		this.status = Reminder.Status.Canceled;
	}

	setFailedStatus() {
		this.status = Reminder.Status.Failed;
	}
}

Reminder.Status = {
	Pending: 'Pending',
	Sent: 'Sent',
	Canceled: 'Canceled',
	Failed: 'Failed'
};

export default Reminder;
