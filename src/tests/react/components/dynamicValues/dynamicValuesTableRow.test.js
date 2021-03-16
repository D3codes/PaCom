import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import DynamicValuesTableRow from '../../../../react/components/dynamicValues/dynamicValuesTableRow';
import DynamicValue from '../../../../react/models/dynamicValue';

jest.mock('../../../../react/utilities/persistentStorage');

const table = document.createElement('table');
const tableBody = document.createElement('tbody');
table.appendChild(tableBody);

describe('DynamicValuesTableRow', () => {
	it('renders without crashing', () => {
		const { getByText } = render(
			<DynamicValuesTableRow
				value={new DynamicValue('a', false)}
				onEdit={() => {}}
				onRemove={() => {}}
			/>, {
				container: document.body.appendChild(tableBody)
			}
		);
		expect(getByText('a')).toBeDefined();
	});
});
