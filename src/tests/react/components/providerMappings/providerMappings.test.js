import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProviderMappings from '../../../../react/components/providerMappings/providerMappings';

describe('ProviderMappings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<ProviderMappings />);
		expect(getByText('This is the Provider Mappings Content')).toBeDefined();
	});
});
