import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Simulate } from 'react-dom/test-utils';
import TwilioSettings from '../../../../react/components/settings/twilioSettings';
import persistantStorageMock from '../../../../react/utilities/persistantStorage';

const testSettings = {
	SID: 'AC63677480d512ca668eb026a5f418c106',
	authToken: '28989ab6698acc744599cd35813f00fa',
	phoneNumber: '2513093314',
	callEndpoint: 'https://studio.twilio.com/v1/Flows/FW9b54e08b0cc711b2e640fc74d7a06fee/Executions',
	smsEndpoint: 'https://studio.twilio.com/v1/Flows/FW35be051ebea3362492d9ecea25d8d107/Executions'
};

jest.mock('../../../../react/utilities/persistantStorage');

describe('TwilioSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<TwilioSettings twilio={testSettings} reloadSettings={jest.fn()} />);
		expect(getByText('Download Logs')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});

	it('has the save button disabled until there are changes to save', () => {
		const { getByText, getByTestId } = render(<TwilioSettings twilio={testSettings} reloadSettings={jest.fn()} />);

		expect(getByText('Save')).toBeDisabled();

		const sidField = getByTestId('sid-field').querySelector('input');
		sidField.value = '9137050325';
		Simulate.change(sidField);

		expect(getByText('Save')).toBeEnabled();
	});

	it('sends updated values to persistant storage and calls reloadSettings on save', () => {
		persistantStorageMock.setTwilioSID.mockImplementation();
		const reloadSettingsMock = jest.fn();
		const { getByText, getByTestId } = render(<TwilioSettings twilio={testSettings} reloadSettings={reloadSettingsMock} />);

		const sidField = getByTestId('sid-field').querySelector('input');
		sidField.value = '9137050325';
		Simulate.change(sidField);
		fireEvent.click(getByText('Save'));

		expect(persistantStorageMock.setTwilioSID).toHaveBeenCalledTimes(1);
		expect(reloadSettingsMock).toBeCalled();
	});

	it('does not enable the save button unless valid data is entered', () => {
		const { getByText, getByTestId } = render(<TwilioSettings twilio={testSettings} reloadSettings={jest.fn()} />);
		expect(getByText('Save')).toBeDisabled();

		const phoneNumberField = getByTestId('phoneNumber-field').querySelector('input');
		phoneNumberField.value = 'bad data';
		Simulate.change(phoneNumberField);
		expect(getByText('Save')).toBeDisabled();

		phoneNumberField.value = '9137050325';
		Simulate.change(phoneNumberField);
		expect(getByText('Save')).toBeEnabled();
	});
});
