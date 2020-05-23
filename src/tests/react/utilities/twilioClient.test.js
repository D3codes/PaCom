import { enableFetchMocks } from 'jest-fetch-mock';
import twilioClient from '../../../react/utilities/twilioClient';
import { NullValueException } from '../../../react/exceptions';

enableFetchMocks();

describe('twilioClient', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('makes one request when sendSMS is called', () => {
		fetch.mockResponseOnce();

		twilioClient.sendSMS('9137050325', 'test').then(res => {
			expect(res).toEqual(true);
		});

		expect(fetch.mock.calls.length).toEqual(1);
	});

	it('makes one request when sendCall is called', () => {
		fetch.mockResponseOnce();

		twilioClient.sendCall('9137050325', 'test').then(res => {
			expect(res).toEqual(true);
		});

		expect(fetch.mock.calls.length).toEqual(1);
	});

	it('throws a NullValueException if a parameter is falsy', () => {
		fetch.mockResponseOnce();

		expect(() => { twilioClient.sendSMS(undefined, 'test'); }).toThrow(NullValueException);
		expect(() => { twilioClient.sendCall('9137050325', undefined); }).toThrow(NullValueException);

		expect(fetch.mock.calls.length).toEqual(0);
	});
});
