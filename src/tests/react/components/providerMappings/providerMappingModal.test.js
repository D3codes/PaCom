import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProviderMappingModal from '../../../../react/components/providerMappings/providerMappingModal';

jest.mock('../../../../react/utilities/persistentStorage');

describe('ProviderMappingModal', () => {
	it('renders without crashing', () => {
		const { getByText, getAllByText } = render(<ProviderMappingModal onCancel={() => {}} onSave={() => {}} open />);
		expect(getByText('Add Provider Mapping')).toBeDefined();
		expect(getAllByText('Source')).toHaveLength(2);
		expect(getAllByText('SMS Target')).toHaveLength(2);
		expect(getAllByText('Phonetic Target')).toHaveLength(2);
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});
});
