import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import AppointmentReminders from '../../../../react/components/appointmentReminders/appointmentReminders';

describe('AppointmentReminders', () => {
	it('renders without crashing', () => {
		const { container } = render(<AppointmentReminders />);
		expect(container.firstChild.className.includes('appointmentRemindersContainer')).toBe(true);
	});
});
