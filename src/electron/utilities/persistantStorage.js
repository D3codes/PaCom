const Store = require('electron-store');

const store = new Store();

const PROVIDER_MAPPINGS = 'providerMappings';
const MESSAGE_TEMPLATES = 'messageTemplates';

const getProviderMappings = () => {
	const providers = store.get(PROVIDER_MAPPINGS);
	return providers ? JSON.parse(providers) : [];
};

const addProviderMapping = (provider) => {
	let providers = getProviderMappings();
	if (!providers) providers = [];
	providers.push(provider);
	store.set(PROVIDER_MAPPINGS, JSON.stringify(providers));
};

const removeProviderMappingWithSource = (providerSource) => {
	let providers = getProviderMappings();
	if (!providers) providers = [];
	providers = providers.filter((provider) => provider.source !== providerSource);
	store.set(PROVIDER_MAPPINGS, JSON.stringify(providers));
};

const getMessageTemplates = () => {
	const templates = store.get(MESSAGE_TEMPLATES);
	return templates ? JSON.parse(templates) : [];
};

const addMessageTemplate = (messageTemplate) => {
	let templates = getMessageTemplates();
	if (!templates) templates = [];
	templates.push(messageTemplate);
	store.set(MESSAGE_TEMPLATES, JSON.stringify(templates));
};

const removeMessageTemplateWithName = (templateName) => {
	let templates = getMessageTemplates();
	if (!templates) templates = [];
	templates = templates.filter((template) => template.name !== templateName);
	store.set(MESSAGE_TEMPLATES, JSON.stringify(templates));
};

module.exports = {
	getProviderMappings,
	addProviderMapping,
	removeProviderMappingWithSource,
	getMessageTemplates,
	addMessageTemplate,
	removeMessageTemplateWithName
};
