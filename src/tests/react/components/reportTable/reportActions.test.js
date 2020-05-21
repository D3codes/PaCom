import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ReportActions from '../../../../react/components/reportTable/reportActions';

describe('ReportActions', () => {
	it('renders export/send buttons without crashing', () => {
		const { container, getByText } = render(<ReportActions />);
		expect(container.firstChild.className.includes('actionContainer')).toBe(true);
		expect(getByText('Export')).toBeDefined();
		expect(getByText('Send')).toBeDefined();
	});
});
