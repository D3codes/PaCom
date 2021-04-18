import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProcedureMappingModal from '../../../../react/components/procedureMappings/procedureMappingModal';

jest.mock('../../../../react/utilities/persistentStorage');

describe('ProcedureMappingModal', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<ProcedureMappingModal onCancel={() => {}} onSave={() => {}} open />);
		expect(getByText('Add Procedure Mapping')).toBeDefined();
		expect(getByText('Source')).toBeDefined();
		expect(getByText('SMS')).toBeDefined();
		expect(getByText('Phonetic')).toBeDefined();
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});
});
