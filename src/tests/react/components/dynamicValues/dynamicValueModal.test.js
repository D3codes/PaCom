import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import DynamicValueModal from '../../../../react/components/dynamicValues/dynamicValueModal';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

describe('DynamicValueModal', () => {
	it('renders without crashing', () => {
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(null));
		const { getByText, getAllByText } = render(<DynamicValueModal onCancel={() => {}} onSave={() => {}} open />);

		expect(getByText('Add Dynamic Value')).toBeDefined();
		expect(getAllByText('Dynamic Value Name')).toHaveLength(2);
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});
});
