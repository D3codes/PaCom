import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import DynamicValuesTable from '../../../../react/components/dynamicValues/dynamicValuesTable';
import DynamicValue from '../../../../react/models/dynamicValue';

jest.mock('../../../../react/utilities/persistentStorage');

const dynamicValues = [
	new DynamicValue('a', false),
	new DynamicValue('b', false)
];

describe('DynamicValuesTable', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<DynamicValuesTable onEdit={() => {}} onRemove={() => {}} />);

		expect(getByText('Name')).toBeDefined();
		expect(getByText('Actions')).toBeDefined();
		expect(getByText('No Dynamic Values Configured')).toBeDefined();
	});

	it('renders providers', () => {
		const { getByText } = render(<DynamicValuesTable onRemove={() => {}} onEdit={() => {}} dynamicValues={dynamicValues} />);

		expect(getByText('a')).toBeDefined();
		expect(getByText('b')).toBeDefined();
	});
});
