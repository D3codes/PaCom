import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
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
	it('renders without crashing', () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));

		const { getByText } = render(
			<MessageCompose
				messageIsValid
				setMessage={jest.fn()}
				message="Test Message"
			/>
		);

		expect(getByText('Test Message')).toBeDefined();
		expect(getByText('Dynamic Values')).toBeDefined();
	});

	it('shows helper text when passed', () => {
		persistentStorageMock.getDynamicValues.mockImplementation(async () => (testValues));

		const { getByText } = render(
			<MessageCompose
				messageIsValid
				setMessage={jest.fn()}
				message="Test Message"
				disableDynamicValues
				helperText="Test Helper Text"
			/>
		);

		expect(getByText('Test Helper Text')).toBeDefined();
	});
});
