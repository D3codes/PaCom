const validateTwilioEndpoint = endpoint => {
	const regex = /https:\/\/studio.twilio.com\/v[1-2]\/Flows\/[a-zA-Z0-9]+\/Executions$/;
	const found = endpoint.match(regex);
	return found ? found[0] : null;
};

export default validateTwilioEndpoint;
