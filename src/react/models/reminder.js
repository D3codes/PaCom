import Model from './model';

class Reminder extends Model {
	constructor(patient, appointment) {
		super();
		this.patient = patient;
		this.appointment = appointment;
		this.status = Reminder.Status.Pending;
		this.statusMessage = '';
	}

	setStatusMessage(message) {
		this.statusMessage = message;
	}

	appendStatusMessage(message) {
		this.statusMessage = this.statusMessage ? `${this.statusMessage}, ${message}` : message;
	}

	setPendingStatus() {
		this.status = Reminder.Status.Pending;
	}

	setSendingStatus() {
		this.status = Reminder.Status.Sending;
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
	Sending: 'Sending',
	Sent: 'Sent',
	Failed: 'Failed'
};

export default Reminder;
