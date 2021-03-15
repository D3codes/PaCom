import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProviderMappingModal from '../../../../react/components/providerMappings/providerMappingModal';

jest.mock('../../../../react/utilities/persistentStorage');

describe('ProviderMappingModal', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<ProviderMappingModal onCancel={() => {}} onSave={() => {}} open />);
		expect(getByText('Add Provider Mapping')).toBeDefined();
		expect(getByText('Source')).toBeDefined();
		expect(getByText('SMS')).toBeDefined();
		expect(getByText('Phonetic')).toBeDefined();
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});
});
