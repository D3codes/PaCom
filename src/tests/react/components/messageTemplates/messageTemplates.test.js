import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {
	render, fireEvent, waitFor, screen
} from '@testing-library/react';
import MessageTemplates from '../../../../react/components/messageTemplates/messageTemplates';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

describe('MessageTemplates', () => {
	it('renders without crashing', async () => {
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behavior: 1 } }));

		render(<MessageTemplates />);

		expect(await screen.findByText('No Message Templates Configured')).toBeDefined();
		expect(await screen.findByText('Add')).toBeDefined();
	});

	it('disables the add button when set to read only', async () => {
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behavior: 1 } }));

		const { getByText } = render(<MessageTemplates />);

		await screen.findByText('Add');
		expect(getByText('Add').parentElement).toBeDisabled();
	});

	it('displays a modal with title \'Add Message Template\' when the Add button is clicked', async () => {
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve({ shareData: { behavior: 0 } }));

		const { getByText } = render(<MessageTemplates />);

		await waitFor(() => {
			expect(getByText('Add').parentElement).toBeEnabled();
		});

		fireEvent.click(getByText('Add'));
		expect(getByText('Add Message Template')).toBeDefined();
	});
});
