import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import AppointmentReminderSettings from '../../../../react/components/settings/appointmentReminderSettings';

describe('AppointmentReminderSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<AppointmentReminderSettings />);
		expect(getByText('This is the Appointment Reminder Settings Content')).toBeDefined();
	});
});
