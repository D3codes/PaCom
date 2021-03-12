import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Simulate } from 'react-dom/test-utils';
import MessageReportSettings from '../../../../react/components/settings/messageReportSettings';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

const testSettings = {
	autosaveReports: false,
	autosaveLocation: '',
	lastReport: ''
};

describe('MessageReportSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<MessageReportSettings messageReports={testSettings} reloadSettings={jest.fn()} hasWritePermission />);

		expect(getByText('Do not AutoSave message reports after sending.')).toBeDefined();
		expect(getByText('AutoSave message reports to the specified location after sending is complete.')).toBeDefined();
	});

	it('does not enable the browse button unless autosave is on', () => {
		const { getByText } = render(<MessageReportSettings messageReports={testSettings} reloadSettings={jest.fn()} hasWritePermission />);

		expect(getByText('Browse').parentElement).toBeDisabled();

		fireEvent.click(getByText('AUTOSAVE'));

		expect(getByText('Browse').parentElement).toBeEnabled();
	});

	it('does not enable the save button until a location has been selected when autosave is on', () => {
		const { getByText, getByTestId } = render(<MessageReportSettings messageReports={testSettings} reloadSettings={jest.fn()} hasWritePermission />);

		expect(getByText('Save').parentElement).toBeDisabled();

		fireEvent.click(getByText('AUTOSAVE'));

		expect(getByText('Save').parentElement).toBeDisabled();

		const browseField = getByTestId('browse-field').querySelector('input');
		browseField.value = 'C:\\new\\test\\location';
		Simulate.change(browseField);

		expect(getByText('Save').parentElement).toBeEnabled();
	});

	it('does not enable the view last report button when no report is given', () => {
		const { getByText } = render(<MessageReportSettings messageReports={testSettings} reloadSettings={jest.fn()} hasWritePermission />);

		expect(getByText('View Last Report').parentElement).toBeDisabled();
	});

	it('does enable the view last report button when a report is given', () => {
		testSettings.lastReport = 'data';
		const { getByText } = render(<MessageReportSettings messageReports={testSettings} reloadSettings={jest.fn()} hasWritePermission />);

		expect(getByText('View Last Report').parentElement).toBeEnabled();
	});

	it('sends updated values to persistent storage and calls reloadSettings on save', () => {
		persistentStorageMock.setMessageReportsAutosaveLocation.mockImplementation();
		const settings = {
			autosaveReports: true,
			autosaveLocation: 'C:\\test\\location',
			lastReport: ''
		};
		const reloadSettingsMock = jest.fn();
		const { getByText, getByTestId } = render(<MessageReportSettings messageReports={settings} reloadSettings={reloadSettingsMock} />);

		const browseField = getByTestId('browse-field').querySelector('input');
		browseField.value = 'C:\\new\\test\\location';
		Simulate.change(browseField);
		fireEvent.click(getByText('Save'));

		expect(persistentStorageMock.setMessageReportsAutosaveLocation).toHaveBeenCalledTimes(1);
		expect(reloadSettingsMock).toBeCalled();
	});
});
