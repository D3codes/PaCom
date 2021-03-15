import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ProviderMappings from '../../../../react/components/providerMappings/providerMappings';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

describe('ProviderMappings', () => {
	it('renders without crashing', () => {
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behaviors: 1 } }));

		const { getByText } = render(<ProviderMappings />);

		expect(getByText('No Provider Mappings')).toBeDefined();
		expect(getByText('Add')).toBeDefined();
	});

	it('disables the add button when set to read only', () => {
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behaviors: 1 } }));

		const { getByText } = render(<ProviderMappings />);

		expect(getByText('Add').parentElement).toBeDisabled();
	});

	it('displays a modal with title \'Add Provider Mapping\' when the Add button is clicked', async () => {
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behaviors: 0 } }));

		const { getByText } = render(<ProviderMappings />);

		await waitFor(() => {
			expect(getByText('Add').parentElement).toBeEnabled();
		});

		fireEvent.click(getByText('Add'));
		expect(getByText('Add Provider Mapping')).toBeDefined();
	});
});
