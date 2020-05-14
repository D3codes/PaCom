class Reminder {
	constructor(patient, appointment) {
		this.patient = patient;
		this.appointment = appointment;
		this.status = 'Pending...';
	}
}

module.exports = Reminder;
