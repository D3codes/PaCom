module.exports = (endpoint) => {
	const regex = /https:\/\/studio.twilio.com\/v1\/Flows\/[a-zA-Z0-9]+\/Executions$/;
	const found = endpoint.match(regex);
	return found ? found[0] : null;
};
