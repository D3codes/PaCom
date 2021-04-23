import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {
	render, fireEvent, waitFor, screen
} from '@testing-library/react';
import MessageTemplates from '../../../../react/components/messageTemplates/messageTemplates';
import Template from '../../../../react/models/template';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

describe('MessageTemplates', () => {
	it('renders empty table without crashing', async () => {
		render(<MessageTemplates templates={[]} procedureMappings={[]} hasWritePermission reload={jest.fn()} />);

		expect(await screen.findByText('No Message Templates Configured')).toBeDefined();
		expect(await screen.findByText('Add')).toBeDefined();
	});

	it('renders templates without crashing', async () => {
		const templates = [
			new Template('Test Template Name', 'Test Template Body'),
			new Template('Test Template Name 2', 'Test Template Body 2')
		];

		render(<MessageTemplates templates={templates} procedureMappings={[]} hasWritePermission reload={jest.fn()} />);

		expect(await screen.findByText('Test Template Name')).toBeDefined();
		expect(await screen.findByText('Test Template Body')).toBeDefined();
		expect(await screen.findByText('Test Template Name 2')).toBeDefined();
		expect(await screen.findByText('Test Template Body 2')).toBeDefined();
	});

	it('disables the add button when set to read only', async () => {
		const { getByText } = render(<MessageTemplates templates={[]} procedureMappings={[]} reload={jest.fn()} />);

		await screen.findByText('Add');
		expect(getByText('Add').parentElement).toBeDisabled();
	});

	it('displays a modal with title \'Add Message Template\' when the Add button is clicked', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(null));

		const { getByText } = render(<MessageTemplates templates={[]} procedureMappings={[]} hasWritePermission reload={jest.fn()} />);

		await waitFor(() => {
			expect(getByText('Add').parentElement).toBeEnabled();
		});

		fireEvent.click(getByText('Add'));
		expect(getByText('Add Message Template')).toBeDefined();
	});
});
