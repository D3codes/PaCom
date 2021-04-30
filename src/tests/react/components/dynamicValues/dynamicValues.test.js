import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {
	render, fireEvent, waitFor, screen
} from '@testing-library/react';
import DynamicValues from '../../../../react/components/dynamicValues/dynamicValues';

describe('DynamicValues', () => {
	it('renders without crashing', async () => {
		render(<DynamicValues dynamicValues={[]} providers={[]} hasWritePermission reload={jest.fn()} />);

		expect(await screen.findByText('No Dynamic Values Configured')).toBeDefined();
		expect(await screen.findByText('Add')).toBeDefined();
	});

	it('disables the add button when set to read only', async () => {
		const { getByText } = render(<DynamicValues dynamicValues={[]} providers={[]} reload={jest.fn()} />);

		await screen.findByText('Add');
		expect(getByText('Add').parentElement).toBeDisabled();
	});

	it('displays a modal with title \'Add Dynamic Value\' when the Add button is clicked', async () => {
		const { getByText } = render(<DynamicValues dynamicValues={[]} providers={[]} hasWritePermission reload={jest.fn()} />);

		await waitFor(() => {
			expect(getByText('Add').parentElement).toBeEnabled();
		});

		fireEvent.click(getByText('Add'));
		expect(getByText('Add Dynamic Value')).toBeDefined();
	});
});
