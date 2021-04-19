import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import MessageTemplateModal from '../../../../react/components/messageTemplates/messageTemplateModal';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

describe('MessageTemplateModal', () => {
	it('renders without crashing', () => {
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(null));
		const { getByText, getAllByText } = render(<MessageTemplateModal onCancel={() => {}} onSave={() => {}} open />);

		expect(getByText('Add Message Template')).toBeDefined();
		expect(getAllByText('Template Name')).toHaveLength(2);
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});
});
