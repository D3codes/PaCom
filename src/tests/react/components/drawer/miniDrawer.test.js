import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import getVersionMock from '../../../../react/utilities/getVersion';
import MiniDrawer from '../../../../react/components/drawer/miniDrawer';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/getVersion');
jest.mock('../../../../react/utilities/persistentStorage');

describe('MiniDrawer', () => {
	it('renders basic mode without crashing', () => {
		getVersionMock.mockImplementation(() => Promise.resolve('0.1.0'));
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			adminAccess: false,
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {},
			sharedConfig: {}
		}));

		const { queryByText } = render(
			<MiniDrawer
				onTabSelect={jest.fn()}
				selectedTabId="sndApptRmdrs"
				disableNavigation={false}
			/>
		);

		expect(queryByText('Appointment Reminders')).toBeDefined();
		expect(queryByText('Custom Messages')).toBeDefined();
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
			sharedConfig: {}
		}));

		const { queryByText } = render(
			<MiniDrawer
				onTabSelect={jest.fn()}
				selectedTabId="sndApptRmdrs"
				disableNavigation={false}
			/>
		);

		expect(queryByText('Appointment Reminders')).toBeDefined();
		expect(queryByText('Custom Messages')).toBeDefined();
		expect(queryByText('Provider Mappings')).toBeDefined();
		expect(queryByText('Message Templates')).toBeDefined();
		expect(queryByText('Settings')).toBeDefined();
	});

	it('calls onTabSelect when a tab is selected', async () => {
		getVersionMock.mockImplementation(() => Promise.resolve('0.1.0'));
		const tabSelectMock = jest.fn();
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			adminAccess: true,
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {},
			sharedConfig: {}
		}));

		const { getByText } = render(
			<MiniDrawer
				onTabSelect={tabSelectMock}
				selectedTabId="sndApptRmdrs"
				disableNavigation={false}
			/>
		);

		const customMessagesTab = getByText('Custom Messages');
		fireEvent.click(customMessagesTab);

		expect(tabSelectMock).toBeCalledTimes(1);
	});

	it('shows backdrop when navigation is disabled', () => {
		getVersionMock.mockImplementation(() => Promise.resolve('0.1.0'));
		const tabSelectMock = jest.fn();
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			adminAccess: true,
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {},
			sharedConfig: {}
		}));

		const { getByTestId } = render(
			<MiniDrawer
				onTabSelect={tabSelectMock}
				selectedTabId="sndApptRmdrs"
				disableNavigation
			/>
		);

		expect(getByTestId('backdrop')).toBeDefined();
	});
});
