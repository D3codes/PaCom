const Appointment = require('../models/appointment');
const ContactMethod = require('../models/conactMethod');
const Patient = require('../models/patient');
const Provider = require('../models/provider');
const Reminder = require('../models/reminder');

class InvalidInputError extends Error {}

module.exports = (rows) => {
	if (!rows) return new InvalidInputError(`Invalid input provided to 'fromPulse' transformer: ${rows}`);
	const reminders = [];
	rows.forEach((row, index) => {
		if (!row[3]) return;

		const [
			company = null,
			paddedProvider = null,
			appointmentDate = null
		] = rows[index - 1];
		const [
			appointmentTime = null,
			appointmentDuration = null,
			name = null,
			accountNumber = null,
			dateOfBirth = null,
			preferredContactMethod = null,
			workPhone = null,
			homePhone = null,
			cellPhone = null
		] = row;

		const contactMethods = [];
		if (homePhone) contactMethods.push(new ContactMethod(homePhone, 'Phone'));
		if (cellPhone) contactMethods.push(new ContactMethod(cellPhone, 'Cell'));
		if (workPhone) contactMethods.push(new ContactMethod(workPhone, 'Work'));

		const patient = new Patient(name, contactMethods, preferredContactMethod);

		const provider = new Provider(paddedProvider);

		const appointment = new Appointment(appointmentDate, appointmentTime, provider, appointmentDuration);

		const reminder = new Reminder(patient, appointment);
		reminders.push(reminder);
	});
	return reminders;
};
