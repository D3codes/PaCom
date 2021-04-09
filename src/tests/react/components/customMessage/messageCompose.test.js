import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageCompose from '../../../../react/components/customMessage/messageCompose';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

const testValues = [
	{
		name: 'Value1',
		default: true
	},
	{
		name: 'Value2',
		default: true
	}
];

jest.mock('../../../../react/utilities/persistentStorage');

describe('MessageCompose', () => {
	it('renders without crashing', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));

		render(
			<MessageCompose
				messageIsValid
				onMessageChange={jest.fn()}
				onAppend={jest.fn()}
				message="Test Message"
			/>
		);

		expect(await screen.findByText('Test Message')).toBeDefined();
		expect(await screen.findByText('Dynamic Values')).toBeDefined();
	});

	it('shows helper text when passed', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));

		render(
			<MessageCompose
				messageIsValid
				onMessageChange={jest.fn()}
				onAppend={jest.fn()}
				message="Test Message"
				disableDynamicValues
				helperText="Test Helper Text"
			/>
		);

		expect(await screen.findByText('Test Helper Text')).toBeDefined();
	});
});
