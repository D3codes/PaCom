import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {
	render, fireEvent, waitFor, screen
} from '@testing-library/react';
import ProviderMappings from '../../../../react/components/providerMappings/providerMappings';

describe('ProviderMappings', () => {
	it('renders without crashing', async () => {
		render(<ProviderMappings providers={[]} hasWritePermission reload={jest.fn()} />);

		expect(await screen.findByText('No Provider Mappings Configured')).toBeDefined();
		expect(await screen.findByText('Add')).toBeDefined();
	});

	it('disables the add button when set to read only', async () => {
		const { getByText } = render(<ProviderMappings providers={[]} reload={jest.fn()} />);

		await screen.findByText('Add');
		expect(getByText('Add').parentElement).toBeDisabled();
	});

	it('displays a modal with title \'Add Provider Mapping\' when the Add button is clicked', async () => {
		const { getByText } = render(<ProviderMappings providers={[]} hasWritePermission reload={jest.fn()} />);

		await waitFor(() => {
			expect(getByText('Add').parentElement).toBeEnabled();
		});

		fireEvent.click(getByText('Add'));
		expect(getByText('Add Provider Mapping')).toBeDefined();
	});
});
