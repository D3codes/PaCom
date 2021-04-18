import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {
	render, fireEvent, waitFor, screen
} from '@testing-library/react';
import ProcedureMappings from '../../../../react/components/procedureMappings/procedureMappings';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

describe('ProcedureMappings', () => {
	it('renders without crashing', async () => {
		persistentStorageMock.getProcedureMappings.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behavior: 1 } }));

		render(<ProcedureMappings />);

		expect(await screen.findByText('No Procedure Mappings Configured')).toBeDefined();
		expect(await screen.findByText('Add')).toBeDefined();
	});

	it('disables the add button when set to read only', async () => {
		persistentStorageMock.getProcedureMappings.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behavior: 1 } }));

		const { getByText } = render(<ProcedureMappings />);

		await screen.findByText('Add');
		expect(getByText('Add').parentElement).toBeDisabled();
	});

	it('displays a modal with title \'Add Procedure Mapping\' when the Add button is clicked', async () => {
		persistentStorageMock.getProcedureMappings.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behavior: 0 } }));

		const { getByText } = render(<ProcedureMappings />);

		await waitFor(() => {
			expect(getByText('Add').parentElement).toBeEnabled();
		});

		fireEvent.click(getByText('Add'));
		expect(getByText('Add Procedure Mapping')).toBeDefined();
	});
});
