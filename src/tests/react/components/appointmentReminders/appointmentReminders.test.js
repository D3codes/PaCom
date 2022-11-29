import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen } from '@testing-library/react';
import AppointmentReminders from '../../../../react/components/appointmentReminders/appointmentReminders';
import getEnvInfoMock from '../../../../react/utilities/envInfo';

jest.mock('../../../../react/utilities/envInfo');

const testSettings = {
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
};

describe('AppointmentReminders', () => {
	it('renders without crashing', async () => {
		getEnvInfoMock.getIsDev.mockImplementation(() => Promise.resolve(false));

		const { container } = render(
			<AppointmentReminders
				providerMappings={[]}
				procedureMappings={[]}
				appointmentReminderSettings={testSettings}
				messageTemplates={[]}
				reload={jest.fn()}
				disableNavigation={false}
				onDisableNavigationChange={jest.fn()}
			/>
		);

		await screen.findByText('Browse for Appointments');
		expect(container.firstChild.className.includes('appointmentRemindersContainer')).toBe(true);
	});
});
