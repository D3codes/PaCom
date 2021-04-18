import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProcedureMappingsTable from '../../../../react/components/procedureMappings/procedureMappingsTable';
import Procedure from '../../../../react/models/procedure';

jest.mock('../../../../react/utilities/persistentStorage');

const procedures = [
	new Procedure('a', 'b', 'c', 'd')
];

describe('ProcedureMappingsTable', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<ProcedureMappingsTable onEdit={() => {}} onRemove={() => {}} />);
		expect(getByText('Source')).toBeDefined();
		expect(getByText('SMS Target')).toBeDefined();
		expect(getByText('Phonetic Target')).toBeDefined();
		expect(getByText('Actions')).toBeDefined();
		expect(getByText('No Procedure Mappings Configured')).toBeDefined();
	});

	it('renders procedures', () => {
		const { getByText } = render(<ProcedureMappingsTable onRemove={() => {}} onEdit={() => {}} procedures={procedures} />);
		expect(getByText('a')).toBeDefined();
		expect(getByText('b')).toBeDefined();
		expect(getByText('c')).toBeDefined();
		expect(getByText('d')).toBeDefined();
		expect(getByText('Default')).toBeDefined();
	});
});
