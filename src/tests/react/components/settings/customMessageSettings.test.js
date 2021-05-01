import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CustomMessageSettings from '../../../../react/components/settings/customMessageSettings';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

const testSettings = {
	dateVerification: {
		numberOfDays: 4,
		endOfRange: 5,
		allowSendOutsideRange: 0,
		useBusinessDays: false
	},
	contactPreferences: {
		sendToPreferredAndSms: false,
		textHomeIfCellNotAvailable: false
	}
};

jest.mock('../../../../react/utilities/persistentStorage');

describe('CustomMessageSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(
			<CustomMessageSettings
				customMessages={testSettings}
				reloadSettings={jest.fn()}
				providers={[]}
				procedures={[]}
				hasWritePermission
			/>
		);
		expect(getByText('Select which Providers and Procedures should receive custom messages by default.')).toBeDefined();
	});

	it('has the save button disabled until there are changes to save', () => {
		const { getByText, getByTestId } = render(
			<CustomMessageSettings
				customMessages={testSettings}
				reloadSettings={jest.fn()}
				providers={[]}
				procedures={[]}
				hasWritePermission
			/>
		);

		expect(getByText('Save').parentElement).toBeDisabled();

		fireEvent.click(getByText('Contact Preferences'));

		const preferredAndSmsCheckbox = getByTestId('preferredAndSms-id').querySelector('input');
		fireEvent.click(preferredAndSmsCheckbox);

		expect(getByText('Save').parentElement).toBeEnabled();
	});

	it('sends updated values to persistent storage and calls reloadSettings on save', () => {
		persistentStorageMock.setAllowSendOutsideRange.mockImplementation();
		const reloadSettingsMock = jest.fn();
		const { getByTestId, getByText } = render(
			<CustomMessageSettings
				customMessages={testSettings}
				reloadSettings={reloadSettingsMock}
				providers={[]}
				procedures={[]}
				hasWritePermission
			/>
		);

		fireEvent.click(getByText('Contact Preferences'));

		const preferredAndSmsCheckbox = getByTestId('preferredAndSms-id').querySelector('input');
		fireEvent.click(preferredAndSmsCheckbox);
		fireEvent.click(getByText('Save'));

		expect(persistentStorageMock.setSendToPreferredAndSmsForCustomMessages).toHaveBeenCalledTimes(1);
		expect(reloadSettingsMock).toBeCalled();
	});
});
