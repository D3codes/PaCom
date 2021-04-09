import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {
	render, fireEvent, waitFor, screen
} from '@testing-library/react';
import DynamicValues from '../../../../react/components/dynamicValues/dynamicValues';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

describe('DynamicValues', () => {
	it('renders without crashing', async () => {
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behaviors: 1 } }));

		render(<DynamicValues />);

		expect(await screen.findByText('No Dynamic Values Configured')).toBeDefined();
		expect(await screen.findByText('Add')).toBeDefined();
	});

	it('disables the add button when set to read only', async () => {
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behavior: 1 } }));

		const { getByText } = render(<DynamicValues />);

		await screen.findByText('Add');
		expect(getByText('Add').parentElement).toBeDisabled();
	});

	it('displays a modal with title \'Add Dynamic Value\' when the Add button is clicked', async () => {
		persistentStorageMock.getProviderMappings.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve([]));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behaviors: 0 } }));

		const { getByText } = render(<DynamicValues />);

		await waitFor(() => {
			expect(getByText('Add').parentElement).toBeEnabled();
		});

		fireEvent.click(getByText('Add'));
		expect(getByText('Add Dynamic Value')).toBeDefined();
	});
});
