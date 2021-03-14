import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ProviderMappings from '../../../../react/components/providerMappings/providerMappings';

describe('ProviderMappings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<ProviderMappings />);
		expect(getByText('No Provider Mappings')).toBeDefined();
	});

	it('adds a table row when the add button is clicked', () => {
		const { getByText } = render(<ProviderMappings />);
		fireEvent.click(getByText('Add'));
		expect(getByText('Convert From (Source)')).toBeDefined();
		expect(getByText('Convert To (SMS)')).toBeDefined();
		expect(getByText('Convert To (Phonetic)')).toBeDefined();
		expect(getByText('Actions')).toBeDefined();
	});
});
