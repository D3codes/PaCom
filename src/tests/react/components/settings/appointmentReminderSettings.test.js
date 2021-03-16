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
	contactPreferences: {
		sendToPreferredAndSms: false,
		textHomeIfCellNotAvailable: false
	},
	defaultReminderTemplates: {
		phone: null,
		sms: null
	}
};

jest.mock('../../../../react/utilities/persistentStorage');

describe('AppointmentReminderSettings', () => {
	it('renders without crashing', () => {
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(null));
		const { getByText } = render(<AppointmentReminderSettings appointmentReminders={testSettings} reloadSettings={jest.fn()} hasWritePermission />);

		expect(getByText('Date Verification')).toBeDefined();
		expect(getByText('Contact Preferences')).toBeDefined();
	});

	it('has the save button disabled until there are changes to save', () => {
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(null));
		const { getByText } = render(<AppointmentReminderSettings appointmentReminders={testSettings} reloadSettings={jest.fn()} hasWritePermission />);

		expect(getByText('Save').parentElement).toBeDisabled();

		fireEvent.click(getByText('WARNING'));

		expect(getByText('Save').parentElement).toBeEnabled();
	});

	it('has the save button stay disabled if there are no write permissions', () => {
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(null));
		const { getByText } = render(<AppointmentReminderSettings appointmentReminders={testSettings} reloadSettings={jest.fn()} hasWritePermission={false} />);

		expect(getByText('Save').parentElement).toBeDisabled();

		fireEvent.click(getByText('WARNING'));

		expect(getByText('Save').parentElement).toBeDisabled();
	});

	it('sends updated values to persistent storage and calls reloadSettings on save', () => {
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.setAllowSendOutsideRange.mockImplementation();
		const reloadSettingsMock = jest.fn();
		const { getByText } = render(<AppointmentReminderSettings appointmentReminders={testSettings} reloadSettings={reloadSettingsMock} hasWritePermission />);

		fireEvent.click(getByText('WARNING'));
		fireEvent.click(getByText('Save'));

		expect(persistentStorageMock.setAllowSendOutsideRange).toHaveBeenCalledTimes(1);
		expect(reloadSettingsMock).toBeCalled();
	});
});
