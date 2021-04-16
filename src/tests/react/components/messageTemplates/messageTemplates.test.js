import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {
	render, fireEvent, waitFor, screen
} from '@testing-library/react';
import MessageTemplates from '../../../../react/components/messageTemplates/messageTemplates';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';
import Template from '../../../../react/models/template';

jest.mock('../../../../react/utilities/persistentStorage');

describe('MessageTemplates', () => {
	it('renders empty table without crashing', async () => {
		const testSettings = {
			shareData: { behavior: 1 },
			appointmentReminders: {
				defaultReminderTemplates: {
					phone: null,
					sms: null
				}
			}
		};
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		render(<MessageTemplates />);

		expect(await screen.findByText('No Message Templates Configured')).toBeDefined();
		expect(await screen.findByText('Add')).toBeDefined();
	});

	it('renders templates without crashing', async () => {
		const testSettings = {
			shareData: { behavior: 1 },
			appointmentReminders: {
				defaultReminderTemplates: {
					phone: null,
					sms: null
				}
			}
		};
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve([
			new Template('Test Template Name', 'Test Template Body'),
			new Template('Test Template Name 2', 'Test Template Body 2')
		]));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		render(<MessageTemplates />);

		expect(await screen.findByText('Test Template Name')).toBeDefined();
		expect(await screen.findByText('Test Template Body')).toBeDefined();
		expect(await screen.findByText('Test Template Name 2')).toBeDefined();
		expect(await screen.findByText('Test Template Body 2')).toBeDefined();
	});

	it('disables the add button when set to read only', async () => {
		const testSettings = {
			shareData: { behavior: 1 },
			appointmentReminders: {
				defaultReminderTemplates: {
					phone: null,
					sms: null
				}
			}
		};
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		const { getByText } = render(<MessageTemplates />);

		await screen.findByText('Add');
		expect(getByText('Add').parentElement).toBeDisabled();
	});

	it('displays a modal with title \'Add Message Template\' when the Add button is clicked', async () => {
		const testSettings = {
			shareData: { behavior: 0 },
			appointmentReminders: {
				defaultReminderTemplates: {
					phone: null,
					sms: null
				}
			}
		};
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(null));
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		const { getByText } = render(<MessageTemplates />);

		await waitFor(() => {
			expect(getByText('Add').parentElement).toBeEnabled();
		});

		fireEvent.click(getByText('Add'));
		expect(getByText('Add Message Template')).toBeDefined();
	});
});
