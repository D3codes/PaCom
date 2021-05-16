import persistentStorage from './persistentStorage';
import envInfo from './envInfo';
import appSettings from '../appSettings.json';

const { NullValueException } = require('../errors/exceptions');

const sendMessage = async (phoneNumber, message, sendAsSms) => {
	const twilioSettings = (await persistentStorage.getSettings()).twilio;
	const trimmedMessage = message.replace(/[\r\n]+/gm, ' ');
	const version = await envInfo.getVersion();
	const response = await fetch(sendAsSms ? twilioSettings.smsEndpoint : twilioSettings.callEndpoint, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(`${twilioSettings.SID}:${twilioSettings.authToken}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `To=${phoneNumber}&From=+1${twilioSettings.phoneNumber}&Parameters={"message": "${trimmedMessage}", "paComVersion": "${version}"}`
	});

	return response.ok;
};

const sendSMS = (phoneNumber, message) => {
	if (!phoneNumber || !message) throw new NullValueException(`Null value provided to "twilioClient": ${phoneNumber}, ${message}`);

	return sendMessage(phoneNumber, message, true);
};

const sendCall = (phoneNumber, message) => {
	if (!phoneNumber || !message) throw new NullValueException(`Null value provided to "twilioClient": ${phoneNumber}, ${message}`);

	return sendMessage(phoneNumber, message, false);
};

const getLogs = async (endpoint, date) => {
	const twilioSettings = (await persistentStorage.getSettings()).twilio;

	const url = `${appSettings.twilio.apiBaseUrl}${twilioSettings.SID}${endpoint}${date.toISOString().slice(0, 10).replace(/-/g, '/')}`;

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Basic ${btoa(`${twilioSettings.SID}:${twilioSettings.authToken}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	return response.json();
};

const getSMSLogs = async date => {
	const data = await getLogs(appSettings.twilio.getMessagesEndpoint, date);
	return data.messages;
};

const getCallLogs = async date => {
	const data = await getLogs(appSettings.twilio.getCallsEndpoint, date);
	return data.calls;
};

export default {
	sendSMS,
	sendCall,
	getSMSLogs,
	getCallLogs
};
