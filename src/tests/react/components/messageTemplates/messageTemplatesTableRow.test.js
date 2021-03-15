import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import MessageTemplatesTableRow from '../../../../react/components/messageTemplates/messageTemplatesTableRow';
import Template from '../../../../react/models/template';

jest.mock('../../../../react/utilities/persistentStorage');

const table = document.createElement('table');
const tableBody = document.createElement('tbody');
table.appendChild(tableBody);

describe('MessageTemplatesTableRow', () => {
	it('renders without crashing', () => {
		const { getByText } = render(
			<MessageTemplatesTableRow
				template={new Template('a', 'b')}
				onEdit={() => {}}
				onRemove={() => {}}
			/>, {
				container: document.body.appendChild(tableBody)
			}
		);
		expect(getByText('a')).toBeDefined();
		expect(getByText('b')).toBeDefined();
	});
});
