import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import getEnvInfoMock from '../../../../react/utilities/getEnvInfo';
import MiniDrawer from '../../../../react/components/drawer/miniDrawer';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/getEnvInfo');
jest.mock('../../../../react/utilities/persistentStorage');

describe('MiniDrawer', () => {
	it('renders basic mode without crashing', async () => {
		getEnvInfoMock.getVersion.mockImplementation(() => Promise.resolve('0.1.0'));
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

		expect(await screen.findByText('Appointment Reminders')).toBeDefined();
		expect(await screen.findByText('Custom Messages')).toBeDefined();
		expect(queryByText('Provider Mappings')).toBeNull();
		expect(queryByText('Message Templates')).toBeNull();
		expect(queryByText('Settings')).toBeNull();
	});

	it('renders admin mode without crashing', async () => {
		getEnvInfoMock.getVersion.mockImplementation(() => Promise.resolve('0.1.0'));
		persistentStorageMock.getSettings.mockImplementation(async () => ({
			adminAccess: true,
			appointmentReminders: {},
			customMessages: {},
			messageReports: {},
			twilio: {},
			sharedConfig: {}
		}));

		render(
			<MiniDrawer
				onTabSelect={jest.fn()}
				selectedTabId="sndApptRmdrs"
				disableNavigation={false}
			/>
		);

		expect(await screen.findByText('Appointment Reminders')).toBeDefined();
		expect(await screen.findAllByText('Custom Messages')).toHaveLength(2);
		expect(await screen.findByText('Provider Mappings')).toBeDefined();
		expect(await screen.findByText('Message Templates')).toBeDefined();
		expect(await screen.findByText('Settings')).toBeDefined();
	});

	it('calls onTabSelect when a tab is selected', async () => {
		getEnvInfoMock.getVersion.mockImplementation(() => Promise.resolve('0.1.0'));
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

		await screen.findByText('Provider Mappings');
		const customMessagesTab = getByText('Provider Mappings');
		fireEvent.click(customMessagesTab);

		expect(tabSelectMock).toBeCalledTimes(1);
	});

	it('shows backdrop when navigation is disabled', async () => {
		getEnvInfoMock.getVersion.mockImplementation(() => Promise.resolve('0.1.0'));
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

		await screen.findByText('Provider Mappings');
		expect(getByTestId('backdrop')).toBeDefined();
	});
});
