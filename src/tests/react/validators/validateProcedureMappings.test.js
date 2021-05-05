import '@testing-library/jest-dom/extend-expect';
import validateProcedureMappings from '../../../react/validators/validateProcedureMappings';
import persistentStorageMock from '../../../react/utilities/persistentStorage';
import Procedure from '../../../react/models/procedure';
import Reminder from '../../../react/models/reminder';
import Appointment from '../../../react/models/appointment';

jest.mock('../../../react/utilities/persistentStorage');

describe('ValidateProcedureMappings', () => {
	it('does not call addProcedureMapping when no procedures are passed', () => {
		const addProcedureMappingMock = jest.fn();
		persistentStorageMock.addProcedureMapping.mockImplementation(addProcedureMappingMock);

		validateProcedureMappings.addUnknownProcedures([]);

		expect(addProcedureMappingMock).toBeCalledTimes(0);
	});

	it('calls addProcedureMapping when passed an unknown procedure', () => {
		const addProcedureMappingMock = jest.fn();
		persistentStorageMock.addProcedureMapping.mockImplementation(addProcedureMappingMock);

		const procedure = new Procedure('test', undefined, undefined, undefined, undefined, true, true);
		const appointment = new Appointment(undefined, undefined, undefined, undefined, procedure);
		const reminder = new Reminder(undefined, appointment);

		validateProcedureMappings.addUnknownProcedures([reminder]);

		expect(addProcedureMappingMock).toBeCalledTimes(1);
	});

	it('does not call addProcedureMapping when passed a procedure with a target value', () => {
		const addProcedureMappingMock = jest.fn();
		persistentStorageMock.addProcedureMapping.mockImplementation(addProcedureMappingMock);

		const procedure = new Procedure('test', 'test target', undefined, undefined, undefined, true, true);
		const appointment = new Appointment(undefined, undefined, undefined, undefined, procedure);
		const reminder = new Reminder(undefined, appointment);

		validateProcedureMappings.addUnknownProcedures([reminder]);

		expect(addProcedureMappingMock).toBeCalledTimes(0);
	});

	it('does not call addProcedureMapping when passed a procedure with a non-default send to reminders state', () => {
		const addProcedureMappingMock = jest.fn();
		persistentStorageMock.addProcedureMapping.mockImplementation(addProcedureMappingMock);

		const procedure = new Procedure('test', undefined, undefined, undefined, undefined, false, true);
		const appointment = new Appointment(undefined, undefined, undefined, undefined, procedure);
		const reminder = new Reminder(undefined, appointment);

		validateProcedureMappings.addUnknownProcedures([reminder]);

		expect(addProcedureMappingMock).toBeCalledTimes(0);
	});

	it('does not call addProcedureMapping when passed a procedure with a non-default send to custom message state', () => {
		const addProcedureMappingMock = jest.fn();
		persistentStorageMock.addProcedureMapping.mockImplementation(addProcedureMappingMock);

		const procedure = new Procedure('test', undefined, undefined, undefined, undefined, true, false);
		const appointment = new Appointment(undefined, undefined, undefined, undefined, procedure);
		const reminder = new Reminder(undefined, appointment);

		validateProcedureMappings.addUnknownProcedures([reminder]);

		expect(addProcedureMappingMock).toBeCalledTimes(0);
	});
});
