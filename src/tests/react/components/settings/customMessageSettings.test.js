import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CustomMessageSettings from '../../../../react/components/settings/customMessageSettings';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

const testSettings = {
	notificationMethod: {
		sendToPreferredAndSms: false,
		textHomeIfCellNotAvailable: false
	}
};

jest.mock('../../../../react/utilities/persistentStorage');

describe('CustomMessageSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<CustomMessageSettings customMessages={testSettings} reloadSettings={jest.fn()} hasWritePermission />);
		expect(getByText("Send messages via SMS as well as patient's preferred contact method")).toBeDefined();
	});

	it('has the save button disabled until there are changes to save', () => {
		const { getByText, getByTestId } = render(<CustomMessageSettings customMessages={testSettings} reloadSettings={jest.fn()} hasWritePermission />);

		expect(getByText('Save').parentElement).toBeDisabled();

		const preferredAndSmsCheckbox = getByTestId('preferredAndSms-id').querySelector('input');
		fireEvent.click(preferredAndSmsCheckbox);

		expect(getByText('Save').parentElement).toBeEnabled();
	});

	it('sends updated values to persistent storage and calls reloadSettings on save', () => {
		persistentStorageMock.setAllowSendOutsideRange.mockImplementation();
		const reloadSettingsMock = jest.fn();
		const { getByTestId, getByText } = render(<CustomMessageSettings customMessages={testSettings} reloadSettings={reloadSettingsMock} hasWritePermission />);

		const preferredAndSmsCheckbox = getByTestId('preferredAndSms-id').querySelector('input');
		fireEvent.click(preferredAndSmsCheckbox);
		fireEvent.click(getByText('Save'));

		expect(persistentStorageMock.setSendToPreferredAndSmsForCustomMessages).toHaveBeenCalledTimes(1);
		expect(reloadSettingsMock).toBeCalled();
	});
});
