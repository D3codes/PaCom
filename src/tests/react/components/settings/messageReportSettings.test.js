import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import MessageReportSettings from '../../../../react/components/settings/messageReportSettings';

describe('MessageReportSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<MessageReportSettings />);
		expect(getByText('This is the Message Report Settings Content')).toBeDefined();
	});
});
