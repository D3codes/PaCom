import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SendTo from '../../../../react/components/settings/sendTo';
import Provider from '../../../../react/models/provider';
import Procedure from '../../../../react/models/procedure';

const testProviders = [
	new Provider('providerSource1', 'providerTarget1', 'providerPhonetic1', true, true),
	new Provider('providerSource2', 'providerTarget2', 'providerPhonetic2', true, true)
];

const testProcedures = [
	new Procedure('procedureSource1', 'procedureTarget1', 'procedurePhonetic1', '', '', true, true),
	new Procedure('procedureSource2', 'procedureTarget2', 'procedurePhonetic2', '', '', true, true)
];

describe('SendTo', () => {
	it('renders without crashing', () => {
		const { getByText } = render(
			<SendTo
				providerMappings={testProviders}
				procedureMappings={testProcedures}
				onProvidersChange={jest.fn()}
				onProceduresChange={jest.fn()}
				hasWritePermission
				forAppointmentReminders
			/>
		);

		expect(getByText('Providers')).toBeDefined();
		expect(getByText('Procedures')).toBeDefined();
	});

	it('renders the providers and procedures without crashing', () => {
		const { getByText } = render(
			<SendTo
				providerMappings={testProviders}
				procedureMappings={testProcedures}
				onProvidersChange={jest.fn()}
				onProceduresChange={jest.fn()}
				hasWritePermission
				forAppointmentReminders
			/>
		);

		expect(getByText('providerTarget1'));
		expect(getByText('providerTarget2'));
		expect(getByText('procedureTarget1'));
		expect(getByText('procedureTarget2'));
	});

	it('calls the onChange function when an item is clicked', () => {
		const onProviderChangeMock = jest.fn();
		const onProcedureChangeMock = jest.fn();
		const { getByTestId } = render(
			<SendTo
				providerMappings={testProviders}
				procedureMappings={testProcedures}
				onProvidersChange={onProviderChangeMock}
				onProceduresChange={onProcedureChangeMock}
				hasWritePermission
				forAppointmentReminders
			/>
		);

		const providerCheckbox = getByTestId('providerCheckbox-providerTarget1').querySelector('input');
		expect(providerCheckbox).toBeChecked();
		fireEvent.click(providerCheckbox);

		expect(onProviderChangeMock).toBeCalledTimes(1);
		expect(onProcedureChangeMock).toBeCalledTimes(0);

		const procedureCheckbox = getByTestId('procedureCheckbox-procedureTarget1').querySelector('input');
		expect(procedureCheckbox).toBeChecked();
		fireEvent.click(procedureCheckbox);

		expect(onProviderChangeMock).toBeCalledTimes(1);
		expect(onProcedureChangeMock).toBeCalledTimes(1);
	});

	it('renders placeholder text when no items passed', () => {
		const { getByText } = render(
			<SendTo
				providerMappings={[]}
				procedureMappings={[]}
				onProvidersChange={jest.fn()}
				onProceduresChange={jest.fn()}
				hasWritePermission
				forAppointmentReminders
			/>
		);

		expect(getByText('No Provider Mappings Configured'));
		expect(getByText('No Procedure Mappings Configured'));
	});
});
