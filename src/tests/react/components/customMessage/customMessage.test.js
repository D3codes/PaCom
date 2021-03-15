import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
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

jest.mock('../../../../react/utilities/persistentStorage');

describe('CustomMessage', () => {
	it('renders without crashing', () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));
		persistentStorageMock.getMessageTemplates.mockImplementation(async () => (testTemplates));

		const { getByText } = render(<CustomMessage />);

		expect(getByText('Send To Specific Number')).toBeDefined();
	});

	it('switches views when toggled', () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));
		persistentStorageMock.getMessageTemplates.mockImplementation(async () => (testTemplates));

		const { getByText, getByTestId } = render(<CustomMessage />);

		expect(getByText('Invalid Phone Number')).toBeDefined();

		const sendByToggle = getByTestId('sendByToggle-id').querySelector('input');
		fireEvent.click(sendByToggle);

		expect(getByText('Browse')).toBeDefined();
	});

	it('keeps send buttons disabled with valid phone number no message', () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));
		persistentStorageMock.getMessageTemplates.mockImplementation(async () => (testTemplates));

		const { getByText, getByTestId } = render(<CustomMessage />);

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

	it('keeps send buttons disabled if sending to specific number and message contains dynamic values', () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));
		persistentStorageMock.getMessageTemplates.mockImplementation(async () => (testTemplates));

		const { getByText, getByTestId } = render(<CustomMessage />);

		const messageField = getByTestId('message-field').querySelector('input');
		messageField.value = '{{dynamic value}}';
		Simulate.change(messageField);

		expect(getByText('Send as SMS').parentElement).toBeDisabled();
		expect(getByText('Send as Call').parentElement).toBeDisabled();
		expect(getByText('Messages sent to a specific number cannot contain dynamic values.')).toBeDefined();
	});
});
