import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen } from '@testing-library/react';
import AppointmentReminders from '../../../../react/components/appointmentReminders/appointmentReminders';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

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
	shareData: {
		behavior: 0,
		location: ''
	}
};

describe('AppointmentReminders', () => {
	it('renders without crashing', async () => {
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		const { container } = render(<AppointmentReminders disableNavigation={false} onDisableNavigationChange={jest.fn()} />);

		await screen.findByText('Browse for Appointment List');
		expect(container.firstChild.className.includes('appointmentRemindersContainer')).toBe(true);
	});
});
