import persistentStorage from './persistentStorage';

const { NullValueException } = require('../exceptions');

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

export default {
	sendSMS,
	sendCall
};
