import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import MessageTemplatesTable from '../../../../react/components/messageTemplates/messageTemplatesTable';
import Template from '../../../../react/models/template';

jest.mock('../../../../react/utilities/persistentStorage');

const templates = [
	new Template('a', 'b')
];

describe('MessageTemplatesTable', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<MessageTemplatesTable onEdit={jest.fn()} onRemove={jest.fn()} />);

		expect(getByText('Name')).toBeDefined();
		expect(getByText('Body')).toBeDefined();
		expect(getByText('Actions')).toBeDefined();
		expect(getByText('No Message Templates Configured')).toBeDefined();
	});

	it('renders templates', () => {
		const { getByText } = render(<MessageTemplatesTable onRemove={jest.fn()} onEdit={jest.fn()} templates={templates} />);

		expect(getByText('a')).toBeDefined();
		expect(getByText('b')).toBeDefined();
	});
});
