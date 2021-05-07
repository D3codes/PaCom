import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Simulate } from 'react-dom/test-utils';
import ProcedureMappingModal from '../../../../react/components/procedureMappings/procedureMappingModal';
import Procedure from '../../../../react/models/procedure';
import dialogControllerMock from '../../../../react/utilities/dialogController';

jest.mock('../../../../react/utilities/persistentStorage');
jest.mock('../../../../react/utilities/dialogController');

describe('ProcedureMappingModal', () => {
	it('renders add modal without crashing', () => {
		const { getByText, getAllByText } = render(<ProcedureMappingModal onCancel={jest.fn()} onSave={jest.fn()} open />);

		expect(getByText('Add Procedure Mapping')).toBeDefined();
		expect(getAllByText('Source')).toHaveLength(2);
		expect(getAllByText('SMS Target')).toHaveLength(2);
		expect(getAllByText('Phonetic Target')).toHaveLength(2);
		expect(getByText('Reminder Template Overrides')).toBeDefined();
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});

	it('renders edit modal without crashing', () => {
		const { getByText, getAllByText } = render(<ProcedureMappingModal onCancel={jest.fn()} onSave={jest.fn()} procedure={new Procedure()} procedures={[]} open />);

		expect(getByText('Edit Procedure Mapping')).toBeDefined();
		expect(getAllByText('Source')).toHaveLength(2);
		expect(getAllByText('SMS Target')).toHaveLength(2);
		expect(getAllByText('Phonetic Target')).toHaveLength(2);
		expect(getByText('Reminder Template Overrides')).toBeDefined();
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});

	it('has save button disabled until all fields are filled in', () => {
		const { getByText, getByTestId } = render(<ProcedureMappingModal onCancel={jest.fn()} onSave={jest.fn()} open />);

		expect(getByText('Save').parentElement).toBeDisabled();

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = 'Test Source';
		Simulate.change(sourceField);

		expect(getByText('Save').parentElement).toBeDisabled();

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = 'Test SMS Target';
		Simulate.change(smsField);

		expect(getByText('Save').parentElement).toBeDisabled();

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = 'Test Phonetic Field';
		Simulate.change(phoneticField);

		expect(getByText('Save').parentElement).toBeEnabled();
	});

	it('presents overwrite dialog if source matches existing procedure source', () => {
		dialogControllerMock.confirmSave.mockImplementation(() => Promise.resolve({ response: 0 }));
		const testProcedure = new Procedure('Test Source', 'Test Target', 'Test Phonetic', 'Default', 'Default', true, true);
		const onSaveMock = jest.fn();
		const { getByText, getByTestId } = render(<ProcedureMappingModal onCancel={jest.fn()} onSave={onSaveMock} procedures={[testProcedure]} open />);

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = testProcedure.source;
		Simulate.change(sourceField);

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = testProcedure.target;
		Simulate.change(smsField);

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = testProcedure.phonetic;
		Simulate.change(phoneticField);

		fireEvent.click(getByText('Save'));

		expect(dialogControllerMock.confirmSave).toBeCalledTimes(1);
	});

	it('calls onSave when source contains existing procedure source', () => {
		dialogControllerMock.confirmSave.mockImplementation(() => Promise.resolve({ response: 0 }));
		const testProcedure = new Procedure('Test Source', 'Test Target', 'Test Phonetic', 'Default', 'Default', true, true);
		const onSaveMock = jest.fn();
		const { getByText, getByTestId } = render(<ProcedureMappingModal onCancel={jest.fn()} onSave={onSaveMock} procedures={[testProcedure]} open />);

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = `padding...${testProcedure.source}...padding`;
		Simulate.change(sourceField);

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = testProcedure.target;
		Simulate.change(smsField);

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = testProcedure.phonetic;
		Simulate.change(phoneticField);

		fireEvent.click(getByText('Save'));

		expect(dialogControllerMock.confirmSave).toBeCalledTimes(0);
		expect(onSaveMock).toBeCalledTimes(1);
	});

	it('calls onSave when source is contained by existing procedure source', () => {
		dialogControllerMock.confirmSave.mockImplementation(() => Promise.resolve({ response: 0 }));
		const testProcedure = new Procedure('Test Source', 'Test Target', 'Test Phonetic', 'Default', 'Default', true, true);
		const onSaveMock = jest.fn();
		const { getByText, getByTestId } = render(<ProcedureMappingModal onCancel={jest.fn()} onSave={onSaveMock} procedures={[testProcedure]} open />);

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = testProcedure.source.slice(2, 8);
		Simulate.change(sourceField);

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = testProcedure.target;
		Simulate.change(smsField);

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = testProcedure.phonetic;
		Simulate.change(phoneticField);

		fireEvent.click(getByText('Save'));

		expect(dialogControllerMock.confirmSave).toBeCalledTimes(0);
		expect(onSaveMock).toBeCalledTimes(1);
	});

	it('calls onSave if source is unique', () => {
		dialogControllerMock.confirmSave.mockImplementation(() => Promise.resolve({ response: 0 }));
		const testProcedure = new Procedure('Test Source', 'Test Target', 'Test Phonetic', 'Default', 'Default', true, true);
		const onSaveMock = jest.fn();
		const { getByText, getByTestId } = render(<ProcedureMappingModal onCancel={jest.fn()} onSave={onSaveMock} procedures={[testProcedure]} open />);

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = 'Unique Source';
		Simulate.change(sourceField);

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = testProcedure.target;
		Simulate.change(smsField);

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = testProcedure.phonetic;
		Simulate.change(phoneticField);

		fireEvent.click(getByText('Save'));

		expect(dialogControllerMock.confirmSave).toBeCalledTimes(0);
		expect(onSaveMock).toBeCalledTimes(1);
	});

	it('calls onSave if no other procedure mappings', () => {
		dialogControllerMock.confirmSave.mockImplementation(() => Promise.resolve({ response: 0 }));
		const testProcedure = new Procedure('Test Source', 'Test Target', 'Test Phonetic', 'Default', 'Default', true, true);
		const onSaveMock = jest.fn();
		const { getByText, getByTestId } = render(<ProcedureMappingModal onCancel={jest.fn()} onSave={onSaveMock} open />);

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = testProcedure.source;
		Simulate.change(sourceField);

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = testProcedure.target;
		Simulate.change(smsField);

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = testProcedure.phonetic;
		Simulate.change(phoneticField);

		fireEvent.click(getByText('Save'));

		expect(dialogControllerMock.confirmSave).toBeCalledTimes(0);
		expect(onSaveMock).toBeCalledTimes(1);
	});
});
