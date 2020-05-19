const { NullValueException } = require('../exceptions');

const SID = 'AC63677480d512ca668eb026a5f418c106';
const AUTH_TOKEN = '28989ab6698acc744599cd35813f00fa';
const NUMBER = '+12513093314';

const sendMessageEndpoint = 'https://studio.twilio.com/v1/Flows/FW35be051ebea3362492d9ecea25d8d107/Executions';
const callEndpoint = 'https://studio.twilio.com/v1/Flows/FW9b54e08b0cc711b2e640fc74d7a06fee/Executions';

const sendMessage = async (phoneNumber, message, endpoint) => {
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(`${SID}:${AUTH_TOKEN}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `To=${phoneNumber}&From=${NUMBER}&Parameters={"message": "${message}"}`
	});

	return response.ok;
};

const sendSMS = (phoneNumber, message) => {
	if(!phoneNumber || !message) throw new NullValueException(`Null value provided to "twilioClient": ${phoneNumber, message}`);

	return sendMessage(phoneNumber, message, sendMessageEndpoint);
}

const sendCall = (phoneNumber, message) => {
	if(!phoneNumber || !message) throw new NullValueException(`Null value provided to "twilioClient": ${phoneNumber, message}`);

	return sendMessage(phoneNumber, message, callEndpoint);
}

export default {
	sendSMS,
	sendCall
};
