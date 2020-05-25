import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import getVersionMock from '../../../react/utilities/getVersion';
import MiniDrawer from '../../../react/components/miniDrawer';
import persistentStorageMock from '../../../react/utilities/persistentStorage';

jest.mock('../../../react/utilities/getVersion');
jest.mock('../../../react/utilities/persistentStorage');

describe('MiniDrawer', () => {
	it('renders basic mode without crashing', () => {
		getVersionMock.mockImplementation(() => Promise.resolve('0.1.0'));
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			adminAccess: false,
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {},
			sharedData: {}
		}));

		const { queryByText } = render(
			<MiniDrawer
				open={false}
				onChevronClick={jest.fn()}
				onTabSelect={jest.fn()}
				selectedTabId="sndApptRmdrs"
				settingsOpen={false}
			/>
		);

		expect(queryByText('Send Appointment Reminders')).toBeDefined();
		expect(queryByText('Send Custom Message')).toBeDefined();
		expect(queryByText('Provider Mappings')).toBeNull();
		expect(queryByText('Message Templates')).toBeNull();
		expect(queryByText('Settings')).toBeNull();
	});

	it('renders admin mode without crashing', () => {
		getVersionMock.mockImplementation(() => Promise.resolve('0.1.0'));
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			adminAccess: true,
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {},
			sharedData: {}
		}));

		const { queryByText } = render(
			<MiniDrawer
				open={false}
				onChevronClick={jest.fn()}
				onTabSelect={jest.fn()}
				selectedTabId="sndApptRmdrs"
				settingsOpen={false}
			/>
		);

		expect(queryByText('Send Appointment Reminders')).toBeDefined();
		expect(queryByText('Send Custom Message')).toBeDefined();
		expect(queryByText('Provider Mappings')).toBeDefined();
		expect(queryByText('Message Templates')).toBeDefined();
		expect(queryByText('Settings')).toBeDefined();
	});
});
