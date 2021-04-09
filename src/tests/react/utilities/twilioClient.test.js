import { enableFetchMocks } from 'jest-fetch-mock';
import twilioClient from '../../../react/utilities/twilioClient';
import { NullValueException } from '../../../react/exceptions';
import persistentStorageMock from '../../../react/utilities/persistentStorage';
import getVersionMock from '../../../react/utilities/getVersion';

jest.mock('../../../react/utilities/persistentStorage');
jest.mock('../../../react/utilities/getVersion');
enableFetchMocks();

describe('twilioClient', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('makes one request when sendSMS is called', async () => {
		fetch.mockResponseOnce();
		getVersionMock.mockImplementation(async () => '2.0.2');
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {
				SID: 'AC63677480d512ca668eb026a5f418c106',
				authToken: '28989ab6698acc744599cd35813f00fa',
				phoneNumber: '2513093314',
				callEndpoint: 'https://studio.twilio.com/v1/Flows/FW9b54e08b0cc711b2e640fc74d7a06fee/Executions',
				smsEndpoint: 'https://studio.twilio.com/v1/Flows/FW35be051ebea3362492d9ecea25d8d107/Executions'
			},
			sharedConfig: {}
		}));

		const res = await twilioClient.sendSMS('9137050325', 'test');

		expect(res).toEqual(true);
		expect(fetch.mock.calls.length).toEqual(1);
	});

	it('makes one request when sendCall is called', async () => {
		fetch.mockResponseOnce();
		getVersionMock.mockImplementation(async () => '2.0.2');
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {
				SID: 'AC63677480d512ca668eb026a5f418c106',
				authToken: '28989ab6698acc744599cd35813f00fa',
				phoneNumber: '2513093314',
				callEndpoint: 'https://studio.twilio.com/v1/Flows/FW9b54e08b0cc711b2e640fc74d7a06fee/Executions',
				smsEndpoint: 'https://studio.twilio.com/v1/Flows/FW35be051ebea3362492d9ecea25d8d107/Executions'
			},
			sharedConfig: {}
		}));

		const res = await twilioClient.sendCall('9137050325', 'test');

		expect(res).toEqual(true);
		expect(fetch.mock.calls.length).toEqual(1);
	});

	it('throws a NullValueException if a parameter is falsy', () => {
		fetch.mockResponseOnce();

		expect(() => { twilioClient.sendSMS(undefined, 'test'); }).toThrow(NullValueException);
		expect(() => { twilioClient.sendCall('9137050325', undefined); }).toThrow(NullValueException);

		expect(fetch.mock.calls.length).toEqual(0);
	});
});
