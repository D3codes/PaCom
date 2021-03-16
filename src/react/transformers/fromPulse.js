import Appointment from '../models/appointment';
import ContactMethod from '../models/conactMethod';
import Patient from '../models/patient';
import Provider from '../models/provider';
import Reminder from '../models/reminder';
import { NullValueException } from '../exceptions';

export default (rows, providerMappings) => {
	if (!rows) throw new NullValueException(`Null value provided to "fromPulse" transformer: ${rows}`);

	const reminders = [];
	rows.forEach((row, index) => {
		if (index === 0 || !row[3]) return;

		// This shift is removing the company from the row
		rows[index - 1].shift();
		const [
			paddedProvider = '',
			appointmentDate = null
		] = rows[index - 1];
		const [
			appointmentTime = null,
			appointmentDuration = null,
			name = null,
			accountNumber = null,
			dateOfBirth = null,
			preferredContactMethod = null,,
			homePhone = null,
			cellPhone = null
		] = row;

		const contactMethods = [];
		if (homePhone) contactMethods.push(ContactMethod.Home(homePhone));
		if (cellPhone) contactMethods.push(ContactMethod.Cell(cellPhone));

		const patient = new Patient(accountNumber, name, contactMethods, preferredContactMethod, dateOfBirth);

		const existingProvider = providerMappings?.find(providerMapping => paddedProvider.includes(providerMapping.source));
		const provider = new Provider(paddedProvider, existingProvider?.target, existingProvider?.phonetic);

		const appointment = new Appointment(appointmentDate, appointmentTime, provider, appointmentDuration);

		const reminder = new Reminder(patient, appointment);
		reminders.push(reminder);
	});
	return reminders;
};
