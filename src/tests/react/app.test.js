import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import usePromiseMock from '../../react/hooks/usePromise';
import App from '../../react/app';
import persistentStorageMock from '../../react/utilities/persistentStorage';

jest.mock('../../react/utilities/getVersion', () => '0.1.0');
jest.mock('../../react/hooks/usePromise');
jest.mock('../../react/utilities/persistentStorage');

describe('App', () => {
	it('renders without crashing', () => {
		usePromiseMock.mockImplementation(() => []);
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {},
			sharedData: {}
		}));

		const { getAllByText } = render(<App />);
		expect(getAllByText('Send Appointment Reminders')).toHaveLength(2);
	});

	// TODO: Add tests for MiniDrawer state management
});
