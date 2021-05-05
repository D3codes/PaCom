import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProviderMappingsTable from '../../../../react/components/providerMappings/providerMappingsTable';
import Provider from '../../../../react/models/provider';

jest.mock('../../../../react/utilities/persistentStorage');

const providers = [
	new Provider('a', 'b', 'c')
];

describe('ProviderMappingsTable', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<ProviderMappingsTable onEdit={() => {}} onRemove={() => {}} />);
		expect(getByText('Source')).toBeDefined();
		expect(getByText('SMS Target')).toBeDefined();
		expect(getByText('Phonetic Target')).toBeDefined();
		expect(getByText('Actions')).toBeDefined();
		expect(getByText('No Provider Mappings Configured')).toBeDefined();
	});

	it('renders providers', () => {
		const { getByText } = render(<ProviderMappingsTable onRemove={() => {}} onEdit={() => {}} providers={providers} />);
		expect(getByText('a')).toBeDefined();
		expect(getByText('b')).toBeDefined();
		expect(getByText('c')).toBeDefined();
	});
});
