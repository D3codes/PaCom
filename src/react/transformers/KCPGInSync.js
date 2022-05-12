/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
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
		name: 'Procedure',
		fromApptList: true,
		mappings: [],
		pathFromReminder: []
	}
];

const transform = (rows, providerMappings = null, procedureMappings = null) => {
	if (!rows) throw new NullValueException(`Null value provided to "KCPGInSync" transformer: ${rows}`);

	const reminders = [];
	rows.forEach((row, index) => {
		if (index === 0 || !row[1]) return;

		let [
			padding = null,
			visitProfile = null,
			paddedProvider = '',
			room = null,
			appointmentDate = null,
			appointmentTime = null,
			visitStatus = null,
			encounterStatus = null,
			superbillStatus = null,
			claimStatus = null,
			name = null,
			lastName = null,
			firstName = null,
			patientGroup = null,
			accountNumber = null,
			eRin = null,
			homePhone = null,
			cellPhone = null,
			patientCategory = null,
			blockedReason = null,
			paddedProcedure = null
		] = JSON.parse(row);

		const contactMethods = [];
		if (homePhone) contactMethods.push(ContactMethod.Home(homePhone));
		if (cellPhone) contactMethods.push(ContactMethod.Cell(cellPhone));

		const patient = new Patient(accountNumber, `${lastName}, ${firstName}`, contactMethods, cellPhone ? 'Cell' : 'Phone', '');

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

		const existingProcedure = procedureMappings?.find(procedureMapping => paddedProcedure === procedureMapping.source);
		const procedure = new Procedure(
			paddedProcedure,
			existingProcedure?.target,
			existingProcedure?.phonetic,
			existingProcedure?.phoneReminder,
			existingProcedure?.smsReminder,
			existingProcedure?.sendToReminder ?? true,
			existingProcedure?.sendToCustom ?? true
		);

		const appointment = new Appointment(new Date(appointmentDate).toUTCString().split(' 00:00:00 ')[0], appointmentTime, provider, '', procedure);

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
