import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen } from '@testing-library/react';
import getEnvInfoMock from '../../react/utilities/getEnvInfo';
import App from '../../react/app';
import persistentStorageMock from '../../react/utilities/persistentStorage';
import sendingStatusMock from '../../react/utilities/sendingStatus';

jest.mock('../../react/utilities/getEnvInfo');
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
		getEnvInfoMock.getVersion.mockImplementation(() => Promise.resolve('0.1.0'));
		getEnvInfoMock.getIsDev.mockImplementation(() => Promise.resolve(false));
		persistentStorageMock.getSettings.mockImplementation(async () => testSettings);
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getProcedureMappings.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve([]));
		sendingStatusMock.update.mockImplementation(() => Promise.resolve([]));

		render(<App />);
		expect(await screen.findAllByText('Appointment Reminders')).toHaveLength(2);
	});

	it('renders in dev mode without crashing', async () => {
		getEnvInfoMock.getVersion.mockImplementation(() => Promise.resolve('0.1.0'));
		getEnvInfoMock.getIsDev.mockImplementation(() => Promise.resolve(true));
		persistentStorageMock.getSettings.mockImplementation(async () => testSettings);
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getProcedureMappings.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve([]));
		sendingStatusMock.update.mockImplementation(() => Promise.resolve([]));

		render(<App />);
		expect(await screen.findAllByText('Appointment Reminders')).toHaveLength(2);
		expect(await screen.findByText('DEV MODE')).toBeDefined();
	});
});
