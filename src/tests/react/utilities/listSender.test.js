import '@testing-library/jest-dom/extend-expect';
import listSender from '../../../react/utilities/listSender';
import persistentStorageMock from '../../../react/utilities/persistentStorage';
import twilioClientMock from '../../../react/utilities/twilioClient';
import dynamicValueReplacerMock from '../../../react/utilities/dynamicValueReplacer';
import reportExporterMock from '../../../react/utilities/reportExporter';
import Provider from '../../../react/models/provider';
import Procedure from '../../../react/models/procedure';

jest.mock('../../../react/utilities/persistentStorage');
jest.mock('../../../react/utilities/twilioClient');
jest.mock('../../../react/utilities/dynamicValueReplacer');
jest.mock('../../../react/utilities/reportExporter');

describe('ListSender', () => {
	it('sends no messages when no reminders passed', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(null));
		const sendSMSMock = jest.fn(() => Promise.resolve(null));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: false,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Reminders
		const remindersMock = [];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(0);
				expect(sendSMSMock).toBeCalledTimes(0);
				expect(onUpdateMock).toBeCalledTimes(0);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [], []);
	});

	it('sends sms correctly', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(true));
		const sendSMSMock = jest.fn(() => Promise.resolve(true));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: false,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			},
			{
				name: 'Text',
				body: 'Text Template'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Text');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSentStatus: setSentStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(0);
				expect(sendSMSMock).toBeCalledTimes(1);
				expect(onUpdateMock).toBeCalledTimes(2);
				expect(setSendingStatusMock).toBeCalledTimes(1);
				expect(setFailedStatusMock).toBeCalledTimes(0);
				expect(setSentStatusMock).toBeCalledTimes(1);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [], []);
	});

	it('sends call correctly', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(true));
		const sendSMSMock = jest.fn(() => Promise.resolve(true));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: false,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			},
			{
				name: 'Cell',
				body: 'Cell Template'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Cell');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSentStatus: setSentStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(1);
				expect(sendSMSMock).toBeCalledTimes(0);
				expect(onUpdateMock).toBeCalledTimes(3);
				expect(setSendingStatusMock).toBeCalledTimes(1);
				expect(setFailedStatusMock).toBeCalledTimes(0);
				expect(setSentStatusMock).toBeCalledTimes(1);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [], []);
	});

	it('sets a failed status when getting a bad response from Twilio', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(false));
		const sendSMSMock = jest.fn(() => Promise.resolve(false));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: false,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			},
			{
				name: 'Cell',
				body: 'Cell Template'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Cell');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSentStatus: setSentStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(1);
				expect(sendSMSMock).toBeCalledTimes(0);
				expect(onUpdateMock).toBeCalledTimes(3);
				expect(setSendingStatusMock).toBeCalledTimes(1);
				expect(setFailedStatusMock).toBeCalledTimes(1);
				expect(setSentStatusMock).toBeCalledTimes(0);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [], []);
	});

	it('sends both call and sms when sendToPreferredAndSms is true', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(true));
		const sendSMSMock = jest.fn(() => Promise.resolve(true));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: true,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			},
			{
				name: 'Cell',
				body: 'Cell Template'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Cell');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSentStatus: setSentStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(1);
				expect(sendSMSMock).toBeCalledTimes(1);
				expect(onUpdateMock).toBeCalledTimes(3);
				expect(setSendingStatusMock).toBeCalledTimes(2);
				expect(setFailedStatusMock).toBeCalledTimes(0);
				expect(setSentStatusMock).toBeCalledTimes(1);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [], []);
	});

	it('does not call export when autosaveReports is false', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(true));
		const sendSMSMock = jest.fn(() => Promise.resolve(true));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: true,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Report Exporter
		const mockExport = jest.fn();
		reportExporterMock.exportReport.mockImplementation(mockExport);

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Cell');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSentStatus: setSentStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(1);
				expect(sendSMSMock).toBeCalledTimes(1);
				expect(onUpdateMock).toBeCalledTimes(3);
				expect(setSendingStatusMock).toBeCalledTimes(2);
				expect(setFailedStatusMock).toBeCalledTimes(0);
				expect(setSentStatusMock).toBeCalledTimes(1);
				expect(mockExport).toBeCalledTimes(0);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [], []);
	});

	it('calls export when autosaveReports is true', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(true));
		const sendSMSMock = jest.fn(() => Promise.resolve(true));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: true,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: true,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Report Exporter
		const mockExport = jest.fn();
		reportExporterMock.exportReport.mockImplementation(mockExport);

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Cell');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSentStatus: setSentStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(1);
				expect(sendSMSMock).toBeCalledTimes(1);
				expect(onUpdateMock).toBeCalledTimes(3);
				expect(setSendingStatusMock).toBeCalledTimes(2);
				expect(setFailedStatusMock).toBeCalledTimes(0);
				expect(setSentStatusMock).toBeCalledTimes(1);
				expect(mockExport).toBeCalledTimes(1);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [], []);
	});

	it('skips sending to unselected provider (partial match)', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(true));
		const sendSMSMock = jest.fn(() => Promise.resolve(true));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: false,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			},
			{
				name: 'Text',
				body: 'Text Template'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSkippedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Text');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSentStatus: setSentStatusMock,
				setSkippedStatus: setSkippedStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(0);
				expect(sendSMSMock).toBeCalledTimes(0);
				expect(onUpdateMock).toBeCalledTimes(1);
				expect(setSendingStatusMock).toBeCalledTimes(0);
				expect(setFailedStatusMock).toBeCalledTimes(0);
				expect(setSentStatusMock).toBeCalledTimes(0);
				expect(setSkippedStatusMock).toBeCalledTimes(1);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [], [new Provider('Tex', undefined, undefined, false, false)]);
	});

	it('skips sending to unselected provider (full match)', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(true));
		const sendSMSMock = jest.fn(() => Promise.resolve(true));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: false,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			},
			{
				name: 'Text',
				body: 'Text Template'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSkippedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Text');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSentStatus: setSentStatusMock,
				setSkippedStatus: setSkippedStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(0);
				expect(sendSMSMock).toBeCalledTimes(0);
				expect(onUpdateMock).toBeCalledTimes(1);
				expect(setSendingStatusMock).toBeCalledTimes(0);
				expect(setFailedStatusMock).toBeCalledTimes(0);
				expect(setSentStatusMock).toBeCalledTimes(0);
				expect(setSkippedStatusMock).toBeCalledTimes(1);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [], [new Provider('Text', undefined, undefined, false, false)]);
	});

	it('does not skip sending to unselected procedure (partial match)', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(true));
		const sendSMSMock = jest.fn(() => Promise.resolve(true));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: false,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			},
			{
				name: 'Text',
				body: 'Text Template'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSkippedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Text');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSkippedStatus: setSkippedStatusMock,
				setSentStatus: setSentStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(0);
				expect(sendSMSMock).toBeCalledTimes(1);
				expect(onUpdateMock).toBeCalledTimes(2);
				expect(setSendingStatusMock).toBeCalledTimes(1);
				expect(setFailedStatusMock).toBeCalledTimes(0);
				expect(setSentStatusMock).toBeCalledTimes(1);
				expect(setSkippedStatusMock).toBeCalledTimes(0);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [new Procedure('Tex', undefined, undefined, 'Default', 'Default', false, false)], []);
	});

	it('skips sending to unselected procedure (full match)', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(true));
		const sendSMSMock = jest.fn(() => Promise.resolve(true));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: false,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			},
			{
				name: 'Text',
				body: 'Text Template'
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSkippedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Text');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSkippedStatus: setSkippedStatusMock,
				setSentStatus: setSentStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(0);
				expect(sendSMSMock).toBeCalledTimes(0);
				expect(onUpdateMock).toBeCalledTimes(1);
				expect(setSendingStatusMock).toBeCalledTimes(0);
				expect(setFailedStatusMock).toBeCalledTimes(0);
				expect(setSentStatusMock).toBeCalledTimes(0);
				expect(setSkippedStatusMock).toBeCalledTimes(1);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [new Procedure('Text', undefined, undefined, 'Default', 'Default', false, false)], []);
	});

	it('skips sending SMS only template as call', done => {
		// Mock Twilio Client
		const sendCallMock = jest.fn(() => Promise.resolve(true));
		const sendSMSMock = jest.fn(() => Promise.resolve(true));
		twilioClientMock.sendCall.mockImplementation(sendCallMock);
		twilioClientMock.sendSMS.mockImplementation(sendSMSMock);

		// Mock Settings
		const testSettings = {
			appointmentReminders: {
				contactPreferences: {
					sendToPreferredAndSms: false,
					textHomeIfCellNotAvailable: false
				},
				defaultReminderTemplates: {
					phone: 'phoneTemplate',
					sms: 'smsTemplate'
				}
			},
			messageReports: {
				autosaveReports: false,
				autosaveLocation: ''
			}
		};
		persistentStorageMock.getSettings.mockImplementation(() => Promise.resolve(testSettings));

		// Mock Message Templates
		const testMessageTemplates = [
			{
				name: 'phoneTemplate',
				body: 'phone template body'
			},
			{
				name: 'smsTemplate',
				body: 'sms template body'
			},
			{
				name: 'Cell',
				body: 'Cell Template',
				smsOnly: true
			}
		];
		persistentStorageMock.getMessageTemplates.mockImplementation(() => Promise.resolve(testMessageTemplates));

		// Mock Dynamic Value Replacer
		const replacedMessageMock = 'Replaced Message';
		dynamicValueReplacerMock.replace.mockImplementation(() => Promise.resolve(replacedMessageMock));

		// Mock Reminders
		const setSendingStatusMock = jest.fn();
		const setFailedStatusMock = jest.fn();
		const setSentStatusMock = jest.fn();
		const setSkippedStatusMock = jest.fn();
		const getInMock = jest.fn(() => 'Cell');
		const getPhoneNumberByTypeMock = jest.fn(() => '1234567890');
		const patientMock = {
			getPhoneNumberByType: getPhoneNumberByTypeMock
		};
		const getMock = jest.fn(() => patientMock);
		const setStatusMessageMock = jest.fn();
		const appendStatusMessageMock = jest.fn();
		const remindersMock = [
			{
				setSendingStatus: setSendingStatusMock,
				setFailedStatus: setFailedStatusMock,
				setSentStatus: setSentStatusMock,
				setSkippedStatus: setSkippedStatusMock,
				getIn: getInMock,
				get: getMock,
				setStatusMessage: setStatusMessageMock,
				appendStatusMessage: appendStatusMessageMock
			}
		];

		const onUpdateMock = jest.fn();
		const onComplete = () => {
			try {
				expect(sendCallMock).toBeCalledTimes(0);
				expect(sendSMSMock).toBeCalledTimes(0);
				expect(onUpdateMock).toBeCalledTimes(1);
				expect(setSendingStatusMock).toBeCalledTimes(0);
				expect(setFailedStatusMock).toBeCalledTimes(0);
				expect(setSentStatusMock).toBeCalledTimes(0);
				expect(setSkippedStatusMock).toBeCalledTimes(1);
				done();
			} catch (error) {
				done(error);
			}
		};

		listSender.sendAppointmentReminders(remindersMock, onUpdateMock, onComplete, [], []);
	});
});
