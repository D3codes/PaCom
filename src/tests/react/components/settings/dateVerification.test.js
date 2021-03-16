import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DateVerification from '../../../../react/components/settings/dateVerification';

const testSettings = {
	numberOfDays: 3,
	endOfRange: null,
	allowSendOutsideRange: 0,
	useBusinessDays: true
};

describe('DateVerification', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<DateVerification dateVerification={testSettings} onChange={jest.fn()} hasWritePermission />);

		expect(getByText('OFF')).toBeDefined();
		expect(getByText('WARNING')).toBeDefined();
		expect(getByText('BLOCK')).toBeDefined();
	});

	it('calls onChange function on change', () => {
		const setDateVerificationMock = jest.fn();
		const { getByText } = render(<DateVerification dateVerification={testSettings} onChange={setDateVerificationMock} hasWritePermission />);

		fireEvent.click(getByText('WARNING'));

		expect(setDateVerificationMock).toBeCalled();
	});

	it('disables buttons when there are no write permissions', () => {
		const { getByText } = render(<DateVerification dateVerification={testSettings} onChange={jest.fn()} />);

		expect(getByText('OFF').parentElement.parentElement.parentElement).toBeDisabled();
		expect(getByText('WARNING').parentElement.parentElement.parentElement).toBeDisabled();
		expect(getByText('BLOCK').parentElement.parentElement.parentElement).toBeDisabled();
	});
});
