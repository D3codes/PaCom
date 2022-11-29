import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Simulate } from 'react-dom/test-utils';
import SharedConfigurationSettings from '../../../../react/components/settings/sharedConfigurationSettings';
import persistentStorageMock from '../../../../react/utilities/persistentStorage';

jest.mock('../../../../react/utilities/persistentStorage');

describe('SharedConfigurationSettings', () => {
	it('renders without crashing', () => {
		const testSettings = {
			behavior: 0,
			location: ''
		};
		const { getByText } = render(<SharedConfigurationSettings sharedConfig={testSettings} adminAccess reloadSettings={jest.fn()} />);

		expect(getByText('LOCAL')).toBeDefined();
		expect(getByText('NETWORK - READ ONLY')).toBeDefined();
		expect(getByText('NETWORK - READ AND WRITE')).toBeDefined();
	});

	it('renders in non-admin mode without crashing', () => {
		const testSettings = {
			behavior: 0,
			location: ''
		};
		const { getByText, queryByText } = render(<SharedConfigurationSettings sharedConfig={testSettings} reloadSettings={jest.fn()} />);

		expect(getByText('LOCAL')).toBeDefined();
		expect(getByText('NETWORK - READ ONLY')).toBeDefined();
		expect(queryByText('NETWORK - READ AND WRITE')).toBeNull();
	});

	it('disables location textbox if behavior is set to local', () => {
		const testSettings = {
			behavior: 0,
			location: ''
		};
		const { getByTestId } = render(<SharedConfigurationSettings sharedConfig={testSettings} adminAccess reloadSettings={jest.fn()} />);

		expect(getByTestId('browse-field').querySelector('input')).toBeDisabled();
	});

	it('enables location textbox if behavior is set to network', () => {
		const testSettings = {
			behavior: 1,
			location: ''
		};
		const { getByTestId } = render(<SharedConfigurationSettings sharedConfig={testSettings} adminAccess reloadSettings={jest.fn()} />);

		expect(getByTestId('browse-field').querySelector('input')).toBeEnabled();
	});

	it('disables the copy local to network button if behavior is set to local', () => {
		const testSettings = {
			behavior: 0,
			location: ''
		};
		const { getByText } = render(<SharedConfigurationSettings sharedConfig={testSettings} adminAccess reloadSettings={jest.fn()} />);

		expect(getByText('Copy Local to Network').parentElement).toBeDisabled();
	});

	it('disables the copy local to network button if behavior is set to network - ready only', () => {
		const testSettings = {
			behavior: 1,
			location: ''
		};
		const { getByText } = render(<SharedConfigurationSettings sharedConfig={testSettings} adminAccess reloadSettings={jest.fn()} />);

		expect(getByText('Copy Local to Network').parentElement).toBeDisabled();
	});

	it('disables the copy local to network button if no location is defined', () => {
		const testSettings = {
			behavior: 2,
			location: ''
		};
		const { getByText } = render(<SharedConfigurationSettings sharedConfig={testSettings} adminAccess reloadSettings={jest.fn()} />);

		expect(getByText('Copy Local to Network').parentElement).toBeDisabled();
	});

	it('enables the copy local to network button if behavior is set to network - ready and write and a location is defined', () => {
		const testSettings = {
			behavior: 2,
			location: 'C:\\test\\location'
		};
		const { getByText } = render(<SharedConfigurationSettings sharedConfig={testSettings} adminAccess reloadSettings={jest.fn()} />);

		expect(getByText('Copy Local to Network').parentElement).toBeEnabled();
	});

	it('has the save button disabled until there are changes to save', () => {
		const testSettings = {
			behavior: 2,
			location: 'C:\\test\\location'
		};
		const { getByText, getByTestId } = render(<SharedConfigurationSettings sharedConfig={testSettings} adminAccess reloadSettings={jest.fn()} />);

		expect(getByText('Save').parentElement).toBeDisabled();

		const browseField = getByTestId('browse-field').querySelector('input');
		browseField.value = 'C:\\new\\test\\location';
		Simulate.change(browseField);

		expect(getByText('Save').parentElement).toBeEnabled();
	});

	it('sends updated values to persistent storage and calls reloadSettings on save', () => {
		persistentStorageMock.setShareConfigLocation.mockImplementation();
		const testSettings = {
			behavior: 2,
			location: 'C:\\test\\location'
		};
		const reloadSettingsMock = jest.fn();
		const { getByText, getByTestId } = render(<SharedConfigurationSettings sharedConfig={testSettings} adminAccess reloadSettings={reloadSettingsMock} />);

		const browseField = getByTestId('browse-field').querySelector('input');
		browseField.value = 'C:\\new\\test\\location';
		Simulate.change(browseField);
		fireEvent.click(getByText('Save'));

		expect(persistentStorageMock.setShareConfigLocation).toHaveBeenCalledTimes(1);
		expect(reloadSettingsMock).toBeCalled();
	});
});
