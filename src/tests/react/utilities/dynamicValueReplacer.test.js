import '@testing-library/jest-dom/extend-expect';
import dynamicValueReplacer from '../../../react/utilities/dynamicValueReplacer';
import persistentStorageMock from '../../../react/utilities/persistentStorage';
import transformer from '../../../react/transformers/transformer';

jest.mock('../../../react/utilities/persistentStorage');

describe('DynamicValueReplacer', () => {
	it('returns an identical message when there are no dynamic values', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(null));

		const testMessage = 'Test message with no dynamic values';
		const replacedMessage = await dynamicValueReplacer.replace(testMessage);

		expect(replacedMessage).toEqual(testMessage);
	});

	it('replaces default dynamic values correctly', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(transformer.defaultDynamicValues));
		const mockSetStatusMessage = jest.fn();
		const mockSetFailedStatus = jest.fn();
		const mockGetIn = jest.fn(() => 'Replace With Me!');
		const fakeReminder = {
			setStatusMessage: mockSetStatusMessage,
			setFailedStatus: mockSetFailedStatus,
			getIn: mockGetIn
		};

		const testMessage = 'The replacement text should be here: {{Provider}}';
		const replacedMessage = await dynamicValueReplacer.replace(testMessage, fakeReminder);

		expect(replacedMessage).toEqual('The replacement text should be here: Replace With Me!');
		expect(mockSetStatusMessage).toHaveBeenCalledTimes(0);
		expect(mockSetFailedStatus).toHaveBeenCalledTimes(0);
	});

	it('trims patient name correctly', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(transformer.defaultDynamicValues));
		const mockSetStatusMessage = jest.fn();
		const mockSetFailedStatus = jest.fn();
		const mockGetIn = jest.fn(() => 'Freeman, David D');
		const fakeReminder = {
			setStatusMessage: mockSetStatusMessage,
			setFailedStatus: mockSetFailedStatus,
			getIn: mockGetIn
		};

		const testMessage = 'The replacement text should be here: {{Patient Name}}';
		const replacedMessage = await dynamicValueReplacer.replace(testMessage, fakeReminder);

		expect(replacedMessage).toEqual('The replacement text should be here: David D');
		expect(mockSetStatusMessage).toHaveBeenCalledTimes(0);
		expect(mockSetFailedStatus).toHaveBeenCalledTimes(0);
	});

	it('replaces multiple default dynamic values correctly', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(transformer.defaultDynamicValues));
		const mockSetStatusMessage = jest.fn();
		const mockSetFailedStatus = jest.fn();
		const mockGetIn = jest.fn(() => 'Replace With Me!');
		const fakeReminder = {
			setStatusMessage: mockSetStatusMessage,
			setFailedStatus: mockSetFailedStatus,
			getIn: mockGetIn
		};

		const testMessage = '{{Appointment Date}} The replacement text should be here: {{Provider}}';
		const replacedMessage = await dynamicValueReplacer.replace(testMessage, fakeReminder);

		expect(replacedMessage).toEqual('Replace With Me! The replacement text should be here: Replace With Me!');
		expect(mockSetStatusMessage).toHaveBeenCalledTimes(0);
		expect(mockSetFailedStatus).toHaveBeenCalledTimes(0);
	});

	it('replaces custom dynamic values correctly', async () => {
		const testCustomDynamicValues = [
			{
				name: 'Custom',
				fromApptList: false,
				mappings: [
					{
						providerSource: 'Dr. Test',
						value: 'Replace With Me!'
					}
				]
			}
		];
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(testCustomDynamicValues));
		const mockSetStatusMessage = jest.fn();
		const mockSetFailedStatus = jest.fn();
		const mockGetIn = jest.fn(() => 'Dr. Test');
		const fakeReminder = {
			setStatusMessage: mockSetStatusMessage,
			setFailedStatus: mockSetFailedStatus,
			getIn: mockGetIn
		};

		const testMessage = 'The replacement text should be here: {{Custom}}';
		const replacedMessage = await dynamicValueReplacer.replace(testMessage, fakeReminder);

		expect(replacedMessage).toEqual('The replacement text should be here: Replace With Me!');
		expect(mockSetStatusMessage).toHaveBeenCalledTimes(0);
		expect(mockSetFailedStatus).toHaveBeenCalledTimes(0);
	});

	it('replaces multiple custom dynamic values correctly', async () => {
		const testCustomDynamicValues = [
			{
				name: 'Custom',
				fromApptList: false,
				mappings: [
					{
						providerSource: 'Dr. Test',
						value: 'Replace With Me!'
					}
				]
			}
		];
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(testCustomDynamicValues));
		const mockSetStatusMessage = jest.fn();
		const mockSetFailedStatus = jest.fn();
		const mockGetIn = jest.fn(() => 'Dr. Test');
		const fakeReminder = {
			setStatusMessage: mockSetStatusMessage,
			setFailedStatus: mockSetFailedStatus,
			getIn: mockGetIn
		};

		const testMessage = '{{Custom}} The replacement text should be here: {{Custom}}';
		const replacedMessage = await dynamicValueReplacer.replace(testMessage, fakeReminder);

		expect(replacedMessage).toEqual('Replace With Me! The replacement text should be here: Replace With Me!');
		expect(mockSetStatusMessage).toHaveBeenCalledTimes(0);
		expect(mockSetFailedStatus).toHaveBeenCalledTimes(0);
	});

	it('replaces nested dynamic values correctly', async () => {
		const testCustomDynamicValues = [
			{
				name: 'Custom',
				fromApptList: false,
				mappings: [
					{
						providerSource: 'Dr. Test',
						value: '{{Custom2}}'
					}
				]
			},
			{
				name: 'Custom2',
				fromApptList: true,
				mappings: [],
				pathFromReminder: ['1', '2', '3']
			}
		];
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(testCustomDynamicValues));
		const mockSetStatusMessage = jest.fn();
		const mockSetFailedStatus = jest.fn();
		const mockGetIn = jest.fn(() => 'Dr. Test');
		const fakeReminder = {
			setStatusMessage: mockSetStatusMessage,
			setFailedStatus: mockSetFailedStatus,
			getIn: mockGetIn
		};

		const testMessage = 'The replacement text should be here: {{Custom}}';
		const replacedMessage = await dynamicValueReplacer.replace(testMessage, fakeReminder);

		expect(replacedMessage).toEqual('The replacement text should be here: Dr. Test');
		expect(mockSetStatusMessage).toHaveBeenCalledTimes(0);
		expect(mockSetFailedStatus).toHaveBeenCalledTimes(0);
	});

	it('sets a failed status on the reminder when it cannot get values', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(transformer.defaultDynamicValues));
		const mockSetStatusMessage = jest.fn();
		const mockSetFailedStatus = jest.fn();
		const mockGetIn = jest.fn(() => null);
		const fakeReminder = {
			setStatusMessage: mockSetStatusMessage,
			setFailedStatus: mockSetFailedStatus,
			getIn: mockGetIn
		};

		const testMessage = 'The replacement text should be here: {{Provider}}';
		const replacedMessage = await dynamicValueReplacer.replace(testMessage, fakeReminder);

		expect(replacedMessage).toEqual('');
		expect(mockSetStatusMessage).toHaveBeenCalledTimes(1);
		expect(mockSetFailedStatus).toHaveBeenCalledTimes(1);
	});

	it('sets a failed status on the reminder when it encounters an unknown dynamic value', async () => {
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(transformer.defaultDynamicValues));
		const mockSetStatusMessage = jest.fn();
		const mockSetFailedStatus = jest.fn();
		const mockGetIn = jest.fn(() => 'Replace With Me!');
		const fakeReminder = {
			setStatusMessage: mockSetStatusMessage,
			setFailedStatus: mockSetFailedStatus,
			getIn: mockGetIn
		};

		const testMessage = 'The replacement text should be here: {{Unknown}}';
		const replacedMessage = await dynamicValueReplacer.replace(testMessage, fakeReminder);

		expect(replacedMessage).toEqual('');
		expect(mockSetStatusMessage).toHaveBeenCalledTimes(1);
		expect(mockSetFailedStatus).toHaveBeenCalledTimes(1);
	});

	it('sets a failed status on the reminder when it encounters an unknown nested dynamic value', async () => {
		const testCustomDynamicValues = [
			{
				name: 'Custom',
				fromApptList: false,
				mappings: [
					{
						providerSource: 'Dr. Test',
						value: '{{Unknown}}'
					}
				]
			}
		];
		persistentStorageMock.getDynamicValues.mockImplementation(() => Promise.resolve(testCustomDynamicValues));
		const mockSetStatusMessage = jest.fn();
		const mockSetFailedStatus = jest.fn();
		const mockGetIn = jest.fn(() => 'Dr. Test');
		const fakeReminder = {
			setStatusMessage: mockSetStatusMessage,
			setFailedStatus: mockSetFailedStatus,
			getIn: mockGetIn
		};

		const testMessage = 'The replacement text should be here: {{Custom}}';
		const replacedMessage = await dynamicValueReplacer.replace(testMessage, fakeReminder);

		expect(replacedMessage).toEqual('');
		expect(mockSetStatusMessage).toHaveBeenCalledTimes(1);
		expect(mockSetFailedStatus).toHaveBeenCalledTimes(1);
	});
});
