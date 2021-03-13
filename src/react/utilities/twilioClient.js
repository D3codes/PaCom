import persistentStorage from './persistentStorage';

const { NullValueException } = require('../exceptions');

const TWILIO_API_BASE_URL = 'https://api.twilio.com/2010-04-01/Accounts/';
const TWILIO_GET_MESSAGES_ENDPOINT = '/Messages.json?DateSent=';
const TWILIO_GET_CALLS_ENDPOINT = '/Calls.json?StartTime=';

const sendMessage = async (phoneNumber, message, sendAsSms) => {
	const twilioSettings = (await persistentStorage.getSettings()).twilio;

	const response = await fetch(sendAsSms ? twilioSettings.smsEndpoint : twilioSettings.callEndpoint, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(`${twilioSettings.SID}:${twilioSettings.authToken}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `To=${phoneNumber}&From=+1${twilioSettings.phoneNumber}&Parameters={"message": "${message}"}`
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

const getLogs = async (getCalls, date) => {
	const twilioSettings = (await persistentStorage.getSettings()).twilio;

	const url = TWILIO_API_BASE_URL
		+ twilioSettings.SID
		+ (getCalls ? TWILIO_GET_CALLS_ENDPOINT : TWILIO_GET_MESSAGES_ENDPOINT)
		+ date.toISOString().slice(0, 10).replace(/-/g, '/');

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
	const data = await getLogs(false, date);
	return data.messages;
};

const getCallLogs = async date => {
	const data = await getLogs(true, date);
	return data.calls;
};

export default {
	sendSMS,
	sendCall,
	getSMSLogs,
	getCallLogs
};
