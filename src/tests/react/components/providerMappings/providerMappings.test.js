import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProviderMappings from '../../../../react/components/providerMappings/providerMappings';

jest.mock('../../../../react/utilities/persistentStorage');

describe('ProviderMappings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<ProviderMappings />);
		expect(getByText('No Provider Mappings')).toBeDefined();
	});
});
