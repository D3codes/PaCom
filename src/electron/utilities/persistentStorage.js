const Store = require('electron-store');
const defaultSettings = require('../models/defaultSettings.json');

const store = new Store();

const PROVIDER_MAPPINGS = 'providerMappings';
const MESSAGE_TEMPLATES = 'messageTemplates';
const SETTINGS = 'settings';

const getProviderMappings = () => {
	const providers = store.get(PROVIDER_MAPPINGS);
	return providers ? JSON.parse(providers) : [];
};

const removeProviderMappingWithSource = providerSource => {
	let providers = getProviderMappings();
	if (!providers) return [];
	providers = providers.filter(provider => provider.source !== providerSource);
	store.set(PROVIDER_MAPPINGS, JSON.stringify(providers));
	return getProviderMappings();
};

const addProviderMapping = provider => {
	const providers = removeProviderMappingWithSource(provider.source);
	providers.push(provider);
	store.set(PROVIDER_MAPPINGS, JSON.stringify(providers));
	return getProviderMappings();
};

const getMessageTemplates = () => {
	const templates = store.get(MESSAGE_TEMPLATES);
	return templates ? JSON.parse(templates) : [];
};

const addMessageTemplate = messageTemplate => {
	const templates = getMessageTemplates();
	templates.push(messageTemplate);
	store.set(MESSAGE_TEMPLATES, JSON.stringify(templates));
	return getMessageTemplates();
};

const removeMessageTemplateWithName = templateName => {
	let templates = getMessageTemplates();
	if (!templates) return [];
	templates = templates.filter(template => template.name !== templateName);
	store.set(MESSAGE_TEMPLATES, JSON.stringify(templates));
	return getMessageTemplates();
};

const initializeSettings = () => {
	store.set(defaultSettings);
};

const getSettings = () => {
	let settings = store.get(SETTINGS);
	if (!settings) {
		initializeSettings();
		settings = defaultSettings;
	}
	return settings;
};

const setSettings = (path, value) => {
	store.set(path, value);
	return store.get(path);
};

module.exports = {
	getProviderMappings,
	addProviderMapping,
	removeProviderMappingWithSource,
	getMessageTemplates,
	addMessageTemplate,
	removeMessageTemplateWithName,
	getSettings,
	setSettings
};
