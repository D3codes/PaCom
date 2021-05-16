import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ReportTable from '../../../../react/components/reportTable/reportTable';

import Appointment from '../../../../react/models/appointment';
import ContactMethod from '../../../../react/models/conactMethod';
import Patient from '../../../../react/models/patient';
import Provider from '../../../../react/models/provider';
import Reminder from '../../../../react/models/reminder';

const testPath = 'test/path';
const reminders = [
	new Reminder(
		new Patient(
			'1234567',
			'Caullen R Sasnett',
			[new ContactMethod(
				'+19136838736',
				'Cell'
			)],
			'Cell',
			'01/11/1995'
		),
		new Appointment(
			'01/01/1970',
			'12:00 AM',
			new Provider(
				'Source for Doctor David Freeman',
				'David Freeman',
				'David Freeman'
			),
			'90'
		)
	)
];

describe('ReportTable', () => {
	it('renders no table when no reminders are passed in', () => {
		const { container } = render(<ReportTable onSend={jest.fn()} filePath={testPath} onBack={jest.fn()} onSendToClick={jest.fn()} />);

		expect(container.children[0].children[1].className.includes('noRemindersContainer')).toBe(true);
	});

	it('renders a table and path when reminders are passed in', () => {
		const { container, getByText } = render(
			<ReportTable
				reminders={reminders}
				onSend={jest.fn()}
				filePath={testPath}
				onBack={jest.fn()}
				onSendToClick={jest.fn()}
			/>
		);

		expect(container.children[0].children[1].className.includes('tableContainer')).toBe(true);
		expect(getByText(testPath)).toBeDefined();
	});

	it('renders export and send buttons regardless of reminders being passed in', () => {
		const { getAllByText: getAllByTextNoTable } = render(
			<ReportTable
				onSend={jest.fn()}
				filePath={testPath}
				onBack={jest.fn()}
				onSendToClick={jest.fn()}
			/>
		);
		const { getAllByText: getAllByTextWithTable } = render(
			<ReportTable
				reminders={reminders}
				onSend={jest.fn()}
				filePath={testPath}
				onBack={jest.fn()}
				onSendToClick={jest.fn()}
			/>
		);

		expect(getAllByTextNoTable('Export')).toBeDefined();
		expect(getAllByTextNoTable('Send')).toBeDefined();
		expect(getAllByTextWithTable('Export')).toBeDefined();
		expect(getAllByTextWithTable('Send')).toBeDefined();
	});

	it('disables the back and export buttons when navigation is disabled', async () => {
		const { getByText } = render(
			<ReportTable
				disableNavigation
				onSend={jest.fn()}
				filePath={testPath}
				onBack={jest.fn()}
				onSendToClick={jest.fn()}
			/>
		);

		expect(getByText('Back').parentElement).toBeDisabled();
		expect(getByText('Export').parentElement).toBeDisabled();
	});
});
