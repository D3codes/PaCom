import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProcedureMappingModal from '../../../../react/components/procedureMappings/procedureMappingModal';

jest.mock('../../../../react/utilities/persistentStorage');

describe('ProcedureMappingModal', () => {
	it('renders without crashing', () => {
		const { getByText, getAllByText } = render(<ProcedureMappingModal onCancel={() => {}} onSave={() => {}} open />);
		expect(getByText('Add Procedure Mapping')).toBeDefined();
		expect(getAllByText('Source')).toHaveLength(2);
		expect(getAllByText('SMS Target')).toHaveLength(2);
		expect(getAllByText('Phonetic Target')).toHaveLength(2);
		expect(getByText('Reminder Template Overrides')).toBeDefined();
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});
});
