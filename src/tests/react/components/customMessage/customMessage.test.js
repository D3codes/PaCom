import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Simulate } from 'react-dom/test-utils';
import CustomMessage from '../../../../react/components/customMessage/customMessage';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

const testValues = [
	{
		name: 'Value1',
		default: true
	},
	{
		name: 'Value2',
		default: true
	}
];

const testTemplates = [
	{
		name: 'Template1',
		value: 'This is template 1.'
	},
	{
		name: 'Template2',
		value: 'This is templat 2.'
	}
];

const testSettings = {
	customMessages: {
		dateVerification: {
			numberOfDays: 3,
			endOfRange: null,
			allowSendOutsideRange: 0,
			useBusinessDays: true
		},
		contactPreferences: {
			sendToPreferredAndSms: false,
			textHomeIfCellNotAvailable: false
		}
	},
	shareData: {
		behavior: 0,
		location: ''
	}
};

jest.mock('../../../../react/utilities/persistentStorage');

describe('CustomMessage', () => {
	it('renders without crashing', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));
		persistentStorageMock.getMessageTemplates.mockImplementation(async () => (testTemplates));
		persistentStorageMock.getSettings.mockImplementation(async () => testSettings);

		render(<CustomMessage disableNavigation={false} onDisableNavigationChange={jest.fn()} />);

		expect(await screen.findByText('Send to Number')).toBeDefined();
		expect(await screen.findByText('Templates')).toBeDefined();
		expect(await screen.findByText('Dynamic Values')).toBeDefined();
	});

	it('switches views when toggled', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));
		persistentStorageMock.getMessageTemplates.mockImplementation(async () => (testTemplates));
		persistentStorageMock.getSettings.mockImplementation(async () => testSettings);

		const { getByText } = render(<CustomMessage disableNavigation={false} onDisableNavigationChange={jest.fn()} />);

		expect(await screen.findByText('Invalid Phone Number')).toBeDefined();

		fireEvent.click(getByText('Send to Appointments'));

		expect(await screen.findByText('Browse')).toBeDefined();
	});

	it('keeps send buttons disabled when no message entered', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));
		persistentStorageMock.getMessageTemplates.mockImplementation(async () => (testTemplates));
		persistentStorageMock.getSettings.mockImplementation(async () => testSettings);

		const { getByText, getByTestId } = render(<CustomMessage disableNavigation={false} onDisableNavigationChange={jest.fn()} />);

		await screen.findByText('Send as SMS');
		expect(getByText('Send as SMS').parentElement).toBeDisabled();
		expect(getByText('Send as Call').parentElement).toBeDisabled();

		const phoneNumberField = getByTestId('phoneNumber-field').querySelector('input');
		phoneNumberField.value = 'bad data';
		Simulate.change(phoneNumberField);

		expect(getByText('Send as SMS').parentElement).toBeDisabled();
		expect(getByText('Send as Call').parentElement).toBeDisabled();

		phoneNumberField.value = '1234567890';
		Simulate.change(phoneNumberField);

		expect(getByText('Send as SMS').parentElement).toBeDisabled();
		expect(getByText('Send as Call').parentElement).toBeDisabled();
	});
});
