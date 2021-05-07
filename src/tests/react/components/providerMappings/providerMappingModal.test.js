import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Simulate } from 'react-dom/test-utils';
import ProviderMappingModal from '../../../../react/components/providerMappings/providerMappingModal';
import Provider from '../../../../react/models/provider';

jest.mock('../../../../react/utilities/persistentStorage');
jest.mock('../../../../react/utilities/dialogController');

describe('ProviderMappingModal', () => {
	it('renders add modal without crashing', () => {
		const { getByText, getAllByText } = render(<ProviderMappingModal onCancel={jest.fn()} onSave={jest.fn()} open />);

		expect(getByText('Add Provider Mapping')).toBeDefined();
		expect(getAllByText('Source')).toHaveLength(2);
		expect(getAllByText('SMS Target')).toHaveLength(2);
		expect(getAllByText('Phonetic Target')).toHaveLength(2);
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});

	it('renders edit modal without crashing', () => {
		const { getByText, getAllByText } = render(<ProviderMappingModal onCancel={jest.fn()} onSave={jest.fn()} provider={new Provider()} providers={[]} open />);

		expect(getByText('Edit Provider Mapping')).toBeDefined();
		expect(getAllByText('Source')).toHaveLength(2);
		expect(getAllByText('SMS Target')).toHaveLength(2);
		expect(getAllByText('Phonetic Target')).toHaveLength(2);
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});

	it('has save button disabled until all fields are filled in', () => {
		const { getByText, getByTestId } = render(<ProviderMappingModal onCancel={jest.fn()} onSave={jest.fn()} open />);

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

	it('wont call onSave if source matches existing provider source', () => {
		const testProvider = new Provider('Test Source', 'Test Target', 'Test Phonetic', true, true);
		const onSaveMock = jest.fn();
		const { getByText, getByTestId } = render(<ProviderMappingModal onCancel={jest.fn()} onSave={onSaveMock} providers={[testProvider]} open />);

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = testProvider.source;
		Simulate.change(sourceField);

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = testProvider.target;
		Simulate.change(smsField);

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = testProvider.phonetic;
		Simulate.change(phoneticField);

		fireEvent.click(getByText('Save'));

		expect(onSaveMock).toBeCalledTimes(0);
	});

	it('wont call onSave if source contains existing provider source', () => {
		const testProvider = new Provider('Test Source', 'Test Target', 'Test Phonetic', true, true);
		const onSaveMock = jest.fn();
		const { getByText, getByTestId } = render(<ProviderMappingModal onCancel={jest.fn()} onSave={onSaveMock} providers={[testProvider]} open />);

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = `padding...${testProvider.source}...padding`;
		Simulate.change(sourceField);

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = testProvider.target;
		Simulate.change(smsField);

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = testProvider.phonetic;
		Simulate.change(phoneticField);

		fireEvent.click(getByText('Save'));

		expect(onSaveMock).toBeCalledTimes(0);
	});

	it('wont call onSave if source is contained by existing provider source', () => {
		const testProvider = new Provider('Test Source', 'Test Target', 'Test Phonetic', true, true);
		const onSaveMock = jest.fn();
		const { getByText, getByTestId } = render(<ProviderMappingModal onCancel={jest.fn()} onSave={onSaveMock} providers={[testProvider]} open />);

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = testProvider.source.slice(2, 8);
		Simulate.change(sourceField);

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = testProvider.target;
		Simulate.change(smsField);

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = testProvider.phonetic;
		Simulate.change(phoneticField);

		fireEvent.click(getByText('Save'));

		expect(onSaveMock).toBeCalledTimes(0);
	});

	it('calls onSave if source is unique', () => {
		const testProvider = new Provider('Test Source', 'Test Target', 'Test Phonetic', true, true);
		const onSaveMock = jest.fn();
		const { getByText, getByTestId } = render(<ProviderMappingModal onCancel={jest.fn()} onSave={onSaveMock} providers={[testProvider]} open />);

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = 'Unique Source';
		Simulate.change(sourceField);

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = testProvider.target;
		Simulate.change(smsField);

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = testProvider.phonetic;
		Simulate.change(phoneticField);

		fireEvent.click(getByText('Save'));

		expect(onSaveMock).toBeCalledTimes(1);
	});

	it('calls onSave if no other provider mappings', () => {
		const testProvider = new Provider('Test Source', 'Test Target', 'Test Phonetic', true, true);
		const onSaveMock = jest.fn();
		const { getByText, getByTestId } = render(<ProviderMappingModal onCancel={jest.fn()} onSave={onSaveMock} open />);

		const sourceField = getByTestId('source-field').querySelector('input');
		sourceField.value = testProvider.source;
		Simulate.change(sourceField);

		const smsField = getByTestId('sms-target-field').querySelector('input');
		smsField.value = testProvider.target;
		Simulate.change(smsField);

		const phoneticField = getByTestId('phonetic-target-field').querySelector('input');
		phoneticField.value = testProvider.phonetic;
		Simulate.change(phoneticField);

		fireEvent.click(getByText('Save'));

		expect(onSaveMock).toBeCalledTimes(1);
	});
});
