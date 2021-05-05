import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ProviderDateTableRows from '../../../../react/components/reportTable/providerDateTableRows';

import Appointment from '../../../../react/models/appointment';
import ContactMethod from '../../../../react/models/conactMethod';
import Patient from '../../../../react/models/patient';
import Provider from '../../../../react/models/provider';
import Procedure from '../../../../react/models/procedure';
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
			'90',
			new Procedure('TELEMED')
		)
	)
];

const table = document.createElement('table');
const tableBody = document.createElement('tbody');
table.appendChild(tableBody);

describe('ProviderDateTableRows', () => {
	it('renders the values of the reminders', () => {
		const { getByText, getAllByText } = render(
			<ProviderDateTableRows
				providerDateText="David Freeman 01/01/1970"
				reminders={reminders}
			/>, {
				container: document.body.appendChild(tableBody)
			}
		);

		expect(getByText('Pending')).toBeDefined();
		expect(getByText('David Freeman 01/01/1970')).toBeDefined();
		expect(getByText('12:00 AM')).toBeDefined();
		expect(getByText('90')).toBeDefined();
		expect(getByText('Caullen R Sasnett')).toBeDefined();
		expect(getByText('1234567')).toBeDefined();
		expect(getByText('TELEMED')).toBeDefined();
		expect(getByText('Cell')).toBeDefined();
		expect(getAllByText('-').length).toBe(1);
		expect(getByText('+19136838736')).toBeDefined();
	});
});
