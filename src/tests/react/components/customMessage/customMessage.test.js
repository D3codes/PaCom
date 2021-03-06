import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Simulate } from 'react-dom/test-utils';
import CustomMessage from '../../../../react/components/customMessage/customMessage';

describe('CustomMessage', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<CustomMessage />);

		expect(getByText('Send To Specific Number')).toBeDefined();
	});

	it('switches views when toggled', () => {
		const { getByText, getByTestId } = render(<CustomMessage />);

		expect(getByText('Invalid Phone Number')).toBeDefined();

		const sendByToggle = getByTestId('sendByToggle-id').querySelector('input');
		fireEvent.click(sendByToggle);

		expect(getByText('Browse')).toBeDefined();
	});

	it('keeps send  buttons disabled until valid phone number entered', () => {
		const { getByText, getByTestId } = render(<CustomMessage />);

		expect(getByText('Send as SMS')).toBeDisabled();
		expect(getByText('Send as Call')).toBeDisabled();

		const phoneNumberField = getByTestId('phoneNumber-field').querySelector('input');
		phoneNumberField.value = '1234567890';
		Simulate.change(phoneNumberField);

		expect(getByText('Send as SMS')).toBeEnabled();
		expect(getByText('Send as Call')).toBeEnabled();
	});
});
