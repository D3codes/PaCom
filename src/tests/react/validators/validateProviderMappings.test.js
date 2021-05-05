import '@testing-library/jest-dom/extend-expect';
import validateProviderMappings from '../../../react/validators/validateProviderMappings';
import persistentStorageMock from '../../../react/utilities/persistentStorage';
import Provider from '../../../react/models/provider';
import Reminder from '../../../react/models/reminder';
import Appointment from '../../../react/models/appointment';

jest.mock('../../../react/utilities/persistentStorage');

describe('ValidateProviderMappings', () => {
	it('does not call addProviderMapping when no providers are passed', () => {
		const addProviderMappingsMock = jest.fn();
		persistentStorageMock.addProviderMapping.mockImplementation(addProviderMappingsMock);

		validateProviderMappings.addUnknownProviders([]);

		expect(addProviderMappingsMock).toBeCalledTimes(0);
	});

	it('calls addProviderMapping when passed an unknown provider', () => {
		const addProviderMappingsMock = jest.fn();
		persistentStorageMock.addProviderMapping.mockImplementation(addProviderMappingsMock);

		const provider = new Provider('test', undefined, undefined, true, true);
		const appointment = new Appointment(undefined, undefined, provider, undefined, undefined);
		const reminder = new Reminder(undefined, appointment);

		validateProviderMappings.addUnknownProviders([reminder]);

		expect(addProviderMappingsMock).toBeCalledTimes(1);
	});

	it('does not call addProviderMapping when passed a provider with a target value', () => {
		const addProviderMappingsMock = jest.fn();
		persistentStorageMock.addProviderMapping.mockImplementation(addProviderMappingsMock);

		const provider = new Provider('test', 'test target', undefined, true, true);
		const appointment = new Appointment(undefined, undefined, provider, undefined, undefined);
		const reminder = new Reminder(undefined, appointment);

		validateProviderMappings.addUnknownProviders([reminder]);

		expect(addProviderMappingsMock).toBeCalledTimes(0);
	});

	it('does not call addProviderMapping when passed a provider with a non-default send to reminders state', () => {
		const addProviderMappingsMock = jest.fn();
		persistentStorageMock.addProviderMapping.mockImplementation(addProviderMappingsMock);

		const provider = new Provider('test', undefined, undefined, false, true);
		const appointment = new Appointment(undefined, undefined, provider, undefined, undefined);
		const reminder = new Reminder(undefined, appointment);

		validateProviderMappings.addUnknownProviders([reminder]);

		expect(addProviderMappingsMock).toBeCalledTimes(0);
	});

	it('does not call addProviderMapping when passed a provider with a non-default send to custom message state', () => {
		const addProviderMappingsMock = jest.fn();
		persistentStorageMock.addProviderMapping.mockImplementation(addProviderMappingsMock);

		const provider = new Provider('test', undefined, undefined, true, false);
		const appointment = new Appointment(undefined, undefined, provider, undefined, undefined);
		const reminder = new Reminder(undefined, appointment);

		validateProviderMappings.addUnknownProviders([reminder]);

		expect(addProviderMappingsMock).toBeCalledTimes(0);
	});
});
