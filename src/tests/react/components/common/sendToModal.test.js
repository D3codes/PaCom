import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import SendToModal from '../../../../react/components/common/sendToModal';
import Provider from '../../../../react/models/provider';

describe('SendToModal', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<SendToModal onClose={jest.fn()} providers={[]} procedures={[]} defaultProviders={[]} defaultProcedures={[]} />);

		expect(getByText('Send To')).toBeDefined();
		expect(getByText('Restore Defaults')).toBeDefined();
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});

	it('has the save button disabled and cancel button enabled when first opened', () => {
		const { getByText } = render(<SendToModal onClose={jest.fn()} providers={[]} procedures={[]} defaultProviders={[]} defaultProcedures={[]} />);

		expect(getByText('Save').parentElement).toBeDisabled();
		expect(getByText('Cancel').parentElement).toBeEnabled();
	});

	it('disables restore defaults button when current state is the same as default', () => {
		const { getByText } = render(<SendToModal onClose={jest.fn()} providers={[]} procedures={[]} defaultProviders={[]} defaultProcedures={[]} />);

		expect(getByText('Restore Defaults').parentElement).toBeDisabled();
	});

	it('enables restore defaults button when current state is the same as default', () => {
		const { getByText } = render(<SendToModal onClose={jest.fn()} providers={[]} procedures={[]} defaultProviders={[new Provider()]} defaultProcedures={[]} />);

		expect(getByText('Restore Defaults').parentElement).toBeEnabled();
	});
});