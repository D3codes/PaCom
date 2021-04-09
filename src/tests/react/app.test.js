import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen } from '@testing-library/react';
import getVersionMock from '../../react/utilities/getVersion';
import App from '../../react/app';
import persistentStorageMock from '../../react/utilities/persistentStorage';
import sendingStatusMock from '../../react/utilities/sendingStatus';

jest.mock('../../react/utilities/getVersion');
jest.mock('../../react/utilities/persistentStorage');
jest.mock('../../react/utilities/sendingStatus');

const testSettings = {
	appointmentReminders: {
		dateVerification: {
			numberOfDays: 3,
			endOfRange: null,
			allowSendOutsideRange: 0,
			useBusinessDays: true
		},
		contactPreferences: {
			sendToPreferredAndSms: false,
			textHomeIfCellNotAvailable: false
		},
		defaultReminderTemplates: {
			phone: null,
			sms: null
		}
	},
	customMessages: {},
	messageReports: {},
	twilio: {},
	shareData: {
		behavior: 0,
		location: ''
	}
};

describe('App', () => {
	it('renders without crashing', async () => {
		getVersionMock.mockImplementation(() => Promise.resolve('0.1.0'));
		persistentStorageMock.getSettings.mockImplementation(async () => testSettings);
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve(null));
		sendingStatusMock.update.mockImplementation(() => Promise.resolve([]));

		render(<App />);
		expect(await screen.findAllByText('Appointment Reminders')).toHaveLength(2);
	});
});
