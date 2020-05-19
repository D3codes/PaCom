import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import MessageTemplates from '../../../../react/components/messageTemplates/messageTemplates';

describe('MessageTemplates', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<MessageTemplates />);
		expect(getByText('This is the Message Templates Content')).toBeDefined();
	});
});
