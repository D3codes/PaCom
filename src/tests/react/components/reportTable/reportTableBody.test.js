import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ReportTableBody from '../../../../react/components/reportTable/reportTableBody';

import Appointment from '../../../../react/models/appointment';
import ContactMethod from '../../../../react/models/conactMethod';
import Patient from '../../../../react/models/patient';
import Provider from '../../../../react/models/provider';
import Reminder from '../../../../react/models/reminder';

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

const table = document.createElement('table')

describe('ReportTableBody', () => {
	it('renders the values of the reminders', () => {
		const { getByText, getAllByText } = render(<ReportTableBody reminders={reminders} />, {
			container: document.body.appendChild(table)
		});

		expect(getByText('Pending...')).toBeDefined();
		expect(getByText('David Freeman')).toBeDefined();
		expect(getByText('01/01/1970')).toBeDefined();
		expect(getByText('12:00 AM')).toBeDefined();
		expect(getByText('90')).toBeDefined();
		expect(getByText('Caullen R Sasnett')).toBeDefined();
		expect(getByText('1234567')).toBeDefined();
		expect(getByText('01/11/1995')).toBeDefined();
		expect(getByText('Cell')).toBeDefined();
		expect(getAllByText('Unknown').length).toBe(2);
		expect(getByText('+19136838736')).toBeDefined();
	});
});
