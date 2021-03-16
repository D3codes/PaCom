import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import AppointmentReminders from '../../../../react/components/appointmentReminders/appointmentReminders';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

describe('AppointmentReminders', () => {
	it('renders without crashing', () => {
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve(null));
		const { container } = render(<AppointmentReminders />);
		expect(container.firstChild.className.includes('appointmentRemindersContainer')).toBe(true);
	});
});
