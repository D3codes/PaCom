import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AppointmentReminderSettings from '../../../../react/components/settings/appointmentReminderSettings';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

const testSettings = {
	dateVerification: {
		numberOfDays: 3,
		endOfRange: null,
		allowSendOutsideRange: 0,
		useBusinessDays: true
	},
	notificationMethod: {
		sendToPreferredAndSms: false,
		textHomeIfCellNotAvailable: false
	}
};

jest.mock('../../../../react/utilities/persistentStorage');

describe('AppointmentReminderSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<AppointmentReminderSettings appointmentReminders={testSettings} reloadSettings={jest.fn()} hasWritePermission />);

		expect(getByText('Date Verification')).toBeDefined();
		expect(getByText('Notification Method')).toBeDefined();
	});

	it('has the save button disabled until there are changes to save', () => {
		const { getByText } = render(<AppointmentReminderSettings appointmentReminders={testSettings} reloadSettings={jest.fn()} hasWritePermission />);

		expect(getByText('Save')).toBeDisabled();

		fireEvent.click(getByText('Warning'));

		expect(getByText('Save')).toBeEnabled();
	});

	it('has the save button stay disabled if there are no write permissions', () => {
		const { getByText } = render(<AppointmentReminderSettings appointmentReminders={testSettings} reloadSettings={jest.fn()} hasWritePermission={false} />);

		expect(getByText('Save')).toBeDisabled();

		fireEvent.click(getByText('Warning'));

		expect(getByText('Save')).toBeDisabled();
	});

	it('sends updated values to persistent storage and calls reloadSettings on save', () => {
		persistentStorageMock.setAllowSendOutsideRange.mockImplementation();
		const reloadSettingsMock = jest.fn();
		const { getByText } = render(<AppointmentReminderSettings appointmentReminders={testSettings} reloadSettings={reloadSettingsMock} hasWritePermission />);

		fireEvent.click(getByText('Warning'));
		fireEvent.click(getByText('Save'));

		expect(persistentStorageMock.setAllowSendOutsideRange).toHaveBeenCalledTimes(1);
		expect(reloadSettingsMock).toBeCalled();
	});
});
