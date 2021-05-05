import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProcedureMappingsTableRow from '../../../../react/components/procedureMappings/procedureMappingsTableRow';
import Procedure from '../../../../react/models/procedure';

jest.mock('../../../../react/utilities/persistentStorage');

const table = document.createElement('table');
const tableBody = document.createElement('tbody');
table.appendChild(tableBody);

describe('ProcedureMappingsTableRow', () => {
	it('renders without crashing', () => {
		const { getByText } = render(
			<ProcedureMappingsTableRow
				procedure={new Procedure('a', 'b', 'c', 'd')}
				onEdit={() => {}}
				onRemove={() => {}}
			/>, {
				container: document.body.appendChild(tableBody)
			}
		);
		expect(getByText('a')).toBeDefined();
		expect(getByText('b')).toBeDefined();
		expect(getByText('c')).toBeDefined();
		expect(getByText('d')).toBeDefined();
		expect(getByText('Default')).toBeDefined();
	});
});
