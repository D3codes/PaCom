import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProviderMappingsTableRow from '../../../../react/components/providerMappings/providerMappingsTableRow';
import Provider from '../../../../react/models/provider';

jest.mock('../../../../react/utilities/persistentStorage');

const table = document.createElement('table');
const tableBody = document.createElement('tbody');
table.appendChild(tableBody);

describe('ProviderMappingsTableRow', () => {
	it('renders without crashing', () => {
		const { getByText } = render(
			<ProviderMappingsTableRow
				provider={new Provider('a', 'b', 'c')}
				onEdit={() => {}}
				onRemove={() => {}}
			/>, {
				container: document.body.appendChild(tableBody)
			}
		);
		expect(getByText('a')).toBeDefined();
		expect(getByText('b')).toBeDefined();
		expect(getByText('c')).toBeDefined();
	});
});
