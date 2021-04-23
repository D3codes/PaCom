import Appointment from '../models/appointment';
import ContactMethod from '../models/conactMethod';
import Patient from '../models/patient';
import Provider from '../models/provider';
import Reminder from '../models/reminder';
import Procedure from '../models/procedure';
import { NullValueException } from '../errors/exceptions';
import { ErrorInAppointmentList } from '../localization/en/statusMessageText';

const defaultDynamicValues = [
	{
		name: 'Provider',
		fromApptList: true,
		mappings: [],
		pathFromReminder: []
	},
	{
		name: 'Patient Name',
		fromApptList: true,
		mappings: [],
		pathFromReminder: ['patient', 'name']
	},
	{
		name: 'Appointment Date',
		fromApptList: true,
		mappings: [],
		pathFromReminder: ['appointment', 'date']
	},
	{
		name: 'Appointment Time',
		fromApptList: true,
		mappings: [],
		pathFromReminder: ['appointment', 'time']
	},
	{
		name: 'Appointment Duration',
		fromApptList: true,
		mappings: [],
		pathFromReminder: ['appointment', 'duration']
	},
	{
		name: 'Procedure',
		fromApptList: true,
		mappings: [],
		pathFromReminder: []
	}
];

const transform = (rows, providerMappings = null, procedureMappings = null) => {
	if (!rows) throw new NullValueException(`Null value provided to "KCPG" transformer: ${rows}`);

	const reminders = [];
	rows.forEach((row, index) => {
		if (index === 0 || !row[3]) return;

		// This shift is removing the company from the row
		rows[index - 1].shift();
		let [
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
			cellPhone = null,
			paddedProcedure = null
		] = row;

		const contactMethods = [];
		if (homePhone) contactMethods.push(ContactMethod.Home(homePhone));
		if (cellPhone) contactMethods.push(ContactMethod.Cell(cellPhone));

		const patient = new Patient(accountNumber, name, contactMethods, preferredContactMethod, dateOfBirth);

		const invalidProvider = !paddedProvider || (!Number.isNaN(paddedProvider) && !Number.isNaN(parseFloat(paddedProvider)));
		if (invalidProvider) {
			paddedProvider = '';
			appointmentDate = ErrorInAppointmentList;
		}
		const existingProvider = providerMappings?.find(providerMapping => paddedProvider.includes(providerMapping.source));
		const provider = new Provider(
			paddedProvider,
			existingProvider?.target,
			existingProvider?.phonetic,
			existingProvider?.sendToReminder ?? true,
			existingProvider?.sendToCustom ?? true
		);

		const existingProcedure = procedureMappings?.find(procedureMapping => paddedProcedure.includes(procedureMapping.source));
		const procedure = new Procedure(
			paddedProcedure,
			existingProcedure?.target,
			existingProcedure?.phonetic,
			existingProcedure?.phoneReminder,
			existingProcedure?.smsReminder,
			existingProcedure?.sendToReminder ?? true,
			existingProcedure?.sendToCustom ?? true
		);

		const appointment = new Appointment(appointmentDate, appointmentTime, provider, appointmentDuration, procedure);

		const reminder = new Reminder(patient, appointment);
		if (invalidProvider) {
			reminder.setFailedStatus();
			reminder.setStatusMessage(ErrorInAppointmentList);
		}
		reminders.push(reminder);
	});
	return reminders;
};

export default {
	transform,
	defaultDynamicValues
};
