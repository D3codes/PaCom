import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ReportTableHeader from '../../../../react/components/reportTable/reportTableHeader';

const table = document.createElement('table')

describe('ReportTableHeader', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<ReportTableHeader />, {
			container: document.body.appendChild(table)
		});

		expect(getByText('Status')).toBeDefined();
		expect(getByText('Provider')).toBeDefined();
		expect(getByText('Date')).toBeDefined();
		expect(getByText('Time')).toBeDefined();
		expect(getByText('Duration')).toBeDefined();
		expect(getByText('Patient')).toBeDefined();
		expect(getByText('Account')).toBeDefined();
		expect(getByText('Date of Birth')).toBeDefined();
		expect(getByText('Notify By')).toBeDefined();
		expect(getByText('Work Phone')).toBeDefined();
		expect(getByText('Home Phone')).toBeDefined();
		expect(getByText('Cell Phone')).toBeDefined();
	});
});
