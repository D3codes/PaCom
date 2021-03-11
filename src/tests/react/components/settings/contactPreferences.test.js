import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import ContactPreferences from '../../../../react/components/settings/contactPreferences';

describe('ContactPreferences', () => {
	it('renders without crashing', () => {
		const { getByText } = render(
			<ContactPreferences
				sendToPreferredAndSms
				setSendToPreferredAndSms={jest.fn()}
				textHomeIfCellNotAvailable
				setTextHomeIfCellNotAvailable={jest.fn()}
				hasWritePermission
			/>
		);
		expect(getByText("Send messages via SMS as well as patient's preferred contact method")).toBeDefined();
		expect(getByText('Send SMS to home phone number if cell is not available')).toBeDefined();
	});

	it('calls setSendToPreferredAndSms when checkbox is clicked', () => {
		const setSendToPreferredAndSmsMock = jest.fn();
		const { getByTestId } = render(
			<ContactPreferences
				sendToPreferredAndSms
				setSendToPreferredAndSms={setSendToPreferredAndSmsMock}
				textHomeIfCellNotAvailable
				setTextHomeIfCellNotAvailable={jest.fn()}
				hasWritePermission
			/>
		);

		const preferredAndSmsCheckbox = getByTestId('preferredAndSms-id').querySelector('input');
		Simulate.change(preferredAndSmsCheckbox);

		expect(setSendToPreferredAndSmsMock).toBeCalled();
	});

	it('calls setTextHomeIfCellNotAvailable when checkbox is clicked', () => {
		const setTextHomeIfCellNotAvailableMock = jest.fn();
		const { getByTestId } = render(
			<ContactPreferences
				sendToPreferredAndSms
				setSendToPreferredAndSms={jest.fn()}
				textHomeIfCellNotAvailable
				setTextHomeIfCellNotAvailable={setTextHomeIfCellNotAvailableMock}
				hasWritePermission
			/>
		);

		const textHomeCheckbox = getByTestId('textHome-id').querySelector('input');
		Simulate.change(textHomeCheckbox);

		expect(setTextHomeIfCellNotAvailableMock).toBeCalled();
	});

	it('has checkboxes enabled when there are write permissions', () => {
		const { getByTestId } = render(
			<ContactPreferences
				sendToPreferredAndSms
				setSendToPreferredAndSms={jest.fn()}
				textHomeIfCellNotAvailable
				setTextHomeIfCellNotAvailable={jest.fn()}
				hasWritePermission
			/>
		);

		const preferredAndSmsCheckbox = getByTestId('preferredAndSms-id').querySelector('input');
		const textHomeCheckbox = getByTestId('textHome-id').querySelector('input');

		expect(preferredAndSmsCheckbox).toBeEnabled();
		expect(textHomeCheckbox).toBeEnabled();
	});

	it('has checkboxes disabled when there are no write permissions', () => {
		const { getByTestId } = render(
			<ContactPreferences
				sendToPreferredAndSms
				setSendToPreferredAndSms={jest.fn()}
				textHomeIfCellNotAvailable
				setTextHomeIfCellNotAvailable={jest.fn()}
				hasWritePermission={false}
			/>
		);

		const preferredAndSmsCheckbox = getByTestId('preferredAndSms-id').querySelector('input');
		const textHomeCheckbox = getByTestId('textHome-id').querySelector('input');

		expect(preferredAndSmsCheckbox).toBeDisabled();
		expect(textHomeCheckbox).toBeDisabled();
	});
});
