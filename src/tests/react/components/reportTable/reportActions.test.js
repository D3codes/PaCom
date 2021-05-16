import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ReportActions from '../../../../react/components/reportTable/reportActions';

describe('ReportActions', () => {
	it('renders export/send buttons without crashing', () => {
		const { container, getByText } = render(<ReportActions onSend={jest.fn()} onExport={jest.fn()} onSendToClick={jest.fn()} />);

		expect(container.firstChild.className.includes('actionContainer')).toBe(true);
		expect(getByText('Export')).toBeDefined();
		expect(getByText('Send')).toBeDefined();
	});

	it('calls the correct handler when button is clicked', () => {
		const onSendMock = jest.fn();
		const onExportMock = jest.fn();

		const { getByText } = render(<ReportActions onSend={onSendMock} onExport={onExportMock} onSendToClick={jest.fn()} />);

		fireEvent.click(getByText('Export'));
		expect(onExportMock).toBeCalledTimes(1);
		expect(onSendMock).toBeCalledTimes(0);

		fireEvent.click(getByText('Send'));
		expect(onExportMock).toBeCalledTimes(1);
		expect(onSendMock).toBeCalledTimes(1);
	});
});
