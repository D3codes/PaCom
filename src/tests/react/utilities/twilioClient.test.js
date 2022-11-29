import { enableFetchMocks } from 'jest-fetch-mock';
import twilioClient from '../../../react/utilities/twilioClient';
import { NullValueException } from '../../../react/errors/exceptions';
import persistentStorageMock from '../../../react/utilities/persistentStorage';
import getEnvInfoMock from '../../../react/utilities/envInfo';

jest.mock('../../../react/utilities/persistentStorage');
jest.mock('../../../react/utilities/envInfo');
enableFetchMocks();

const requestBinUrl = 'https://eo1winfxrjpo8o.m.pipedream.net';

describe('twilioClient', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('makes one request when sendSMS is called', async () => {
		const givenFrom = '2513093314';
		const givenTo = '9137050325';
		const givenCallEndpoint = 'https://studio.twilio.com/v1/Flows/FW9b54e08b0cc711b2e640fc74d7a06fee/Executions';
		const givenSmsEndpoint = 'https://studio.twilio.com/v1/Flows/FW35be051ebea3362492d9ecea25d8d107/Executions';
		const givenMessage = 'test';
		const givenVersion = '2.0.2';

		fetch.mockResponseOnce();
		getEnvInfoMock.getVersion.mockImplementation(async () => givenVersion);
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {
				SID: 'AC63677480d512ca668eb026a5f418c106',
				authToken: '28989ab6698acc744599cd35813f00fa',
				phoneNumber: givenFrom,
				callEndpoint: givenCallEndpoint,
				smsEndpoint: givenSmsEndpoint
			},
			sharedConfig: {}
		}));

		const res = await twilioClient.sendSMS(givenTo, givenMessage);

		expect(res).toEqual(true);
		expect(fetch.mock.calls.length).toEqual(1);
		expect(fetch.mock.calls[0][0]).toEqual(givenSmsEndpoint);
		expect(fetch.mock.calls[0][1].body).toEqual(`To=${givenTo}&From=+1${givenFrom}&Parameters={"message": "${givenMessage}", "paComVersion": "${givenVersion}"}`);
	});

	it('makes one request to requestbin when sendSMS is called in dev mode', async () => {
		const givenFrom = '2513093314';
		const givenTo = '9137050325';
		const givenCallEndpoint = 'https://studio.twilio.com/v1/Flows/FW9b54e08b0cc711b2e640fc74d7a06fee/Executions';
		const givenSmsEndpoint = 'https://studio.twilio.com/v1/Flows/FW35be051ebea3362492d9ecea25d8d107/Executions';
		const givenMessage = 'test';
		const givenVersion = '2.0.2';

		fetch.mockResponseOnce();
		getEnvInfoMock.getVersion.mockImplementation(async () => givenVersion);
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {
				SID: 'AC63677480d512ca668eb026a5f418c106',
				authToken: '28989ab6698acc744599cd35813f00fa',
				phoneNumber: givenFrom,
				callEndpoint: givenCallEndpoint,
				smsEndpoint: givenSmsEndpoint
			},
			sharedConfig: {}
		}));

		const res = await twilioClient.sendSMS(givenTo, givenMessage, true);

		expect(res).toEqual(true);
		expect(fetch.mock.calls.length).toEqual(1);
		expect(fetch.mock.calls[0][0]).toEqual(requestBinUrl);
		expect(fetch.mock.calls[0][1].body).toEqual(`{"to":"${givenTo}","from":"${givenFrom}","message":"${givenMessage}","paComVersion":"${givenVersion}","sendAsSms":true}`);
	});

	it('makes one request when sendCall is called', async () => {
		const givenFrom = '2513093314';
		const givenTo = '9137050325';
		const givenCallEndpoint = 'https://studio.twilio.com/v1/Flows/FW9b54e08b0cc711b2e640fc74d7a06fee/Executions';
		const givenSmsEndpoint = 'https://studio.twilio.com/v1/Flows/FW35be051ebea3362492d9ecea25d8d107/Executions';
		const givenMessage = 'test';
		const givenVersion = '2.0.2';

		fetch.mockResponseOnce();
		getEnvInfoMock.getVersion.mockImplementation(async () => givenVersion);
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {
				SID: 'AC63677480d512ca668eb026a5f418c106',
				authToken: '28989ab6698acc744599cd35813f00fa',
				phoneNumber: givenFrom,
				callEndpoint: givenCallEndpoint,
				smsEndpoint: givenSmsEndpoint
			},
			sharedConfig: {}
		}));

		const res = await twilioClient.sendCall(givenTo, givenMessage);

		expect(res).toEqual(true);
		expect(fetch.mock.calls.length).toEqual(1);
		expect(fetch.mock.calls[0][0]).toEqual(givenCallEndpoint);
		expect(fetch.mock.calls[0][1].body).toEqual(`To=${givenTo}&From=+1${givenFrom}&Parameters={"message": "${givenMessage}", "paComVersion": "${givenVersion}"}`);
	});

	it('makes one request to requestbin when sendCall is called in dev mode', async () => {
		const givenFrom = '2513093314';
		const givenTo = '9137050325';
		const givenCallEndpoint = 'https://studio.twilio.com/v1/Flows/FW9b54e08b0cc711b2e640fc74d7a06fee/Executions';
		const givenSmsEndpoint = 'https://studio.twilio.com/v1/Flows/FW35be051ebea3362492d9ecea25d8d107/Executions';
		const givenMessage = 'test';
		const givenVersion = '2.0.2';

		fetch.mockResponseOnce();
		getEnvInfoMock.getVersion.mockImplementation(async () => givenVersion);
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {
				SID: 'AC63677480d512ca668eb026a5f418c106',
				authToken: '28989ab6698acc744599cd35813f00fa',
				phoneNumber: givenFrom,
				callEndpoint: givenCallEndpoint,
				smsEndpoint: givenSmsEndpoint
			},
			sharedConfig: {}
		}));

		const res = await twilioClient.sendCall(givenTo, givenMessage, true);

		expect(res).toEqual(true);
		expect(fetch.mock.calls.length).toEqual(1);
		expect(fetch.mock.calls[0][0]).toEqual(requestBinUrl);
		expect(fetch.mock.calls[0][1].body).toEqual(`{"to":"${givenTo}","from":"${givenFrom}","message":"${givenMessage}","paComVersion":"${givenVersion}","sendAsSms":false}`);
	});

	it('throws a NullValueException if a parameter is falsy', () => {
		fetch.mockResponseOnce();

		expect(() => { twilioClient.sendSMS(undefined, 'test'); }).toThrow(NullValueException);
		expect(() => { twilioClient.sendCall('9137050325', undefined); }).toThrow(NullValueException);
		expect(() => { twilioClient.sendSMS('9137050325', undefined); }).toThrow(NullValueException);
		expect(() => { twilioClient.sendCall(undefined, 'test'); }).toThrow(NullValueException);

		expect(fetch.mock.calls.length).toEqual(0);
	});
});
