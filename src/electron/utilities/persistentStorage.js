/* eslint-disable import/no-extraneous-dependencies */
const Store = require('electron-store');
const { app } = require('electron');
const defaultSettings = require('../models/defaultSettings.json');

let store = new Store();

const PROVIDER_MAPPINGS = 'providerMappings';
const MESSAGE_TEMPLATES = 'messageTemplates';
const SETTINGS = 'settings';

const setStorageLocation = () => {
	store = new Store({ cwd: app.getPath('userData') });
	let settings = store.get(SETTINGS);
	if (!settings) {
		store.set(defaultSettings);
	} else if (settings.shareData.behavior !== 0) {
		store = new Store({ cwd: settings.shareData.location });
		settings = store.get(SETTINGS);
		if (!settings) {
			store.set(defaultSettings);
			settings = defaultSettings;
		}
	}
};

const getProviderMappings = (forceLocal = false) => {
	if (forceLocal) store = new Store({ cwd: app.getPath('userData') });
	else setStorageLocation();
	const providers = store.get(PROVIDER_MAPPINGS);
	return providers || [];
};

const removeProviderMappingWithSource = providerSource => {
	setStorageLocation();
	let providers = getProviderMappings();
	if (!providers) return [];
	providers = providers.filter(provider => provider.source !== providerSource);
	store.set(PROVIDER_MAPPINGS, providers);
	return getProviderMappings();
};

const addProviderMapping = provider => {
	setStorageLocation();
	const providers = removeProviderMappingWithSource(provider.source);
	providers.push(provider);
	store.set(PROVIDER_MAPPINGS, providers);
	return getProviderMappings();
};

const getMessageTemplates = (forceLocal = false) => {
	if (forceLocal) store = new Store({ cwd: app.getPath('userData') });
	else setStorageLocation();
	const templates = store.get(MESSAGE_TEMPLATES);
	return templates || [];
};

const removeMessageTemplateWithName = templateName => {
	setStorageLocation();
	let templates = getMessageTemplates();
	if (!templates) return [];
	templates = templates.filter(template => template.name !== templateName);
	store.set(MESSAGE_TEMPLATES, templates);
	return getMessageTemplates();
};

const addMessageTemplate = messageTemplate => {
	setStorageLocation();
	const templates = removeMessageTemplateWithName(messageTemplate.name);
	templates.push(messageTemplate);
	store.set(MESSAGE_TEMPLATES, templates);
	return getMessageTemplates();
};

const getSettings = (forceLocal = false) => {
	store = new Store({ cwd: app.getPath('userData') });
	let settings = store.get(SETTINGS);
	if (!settings) {
		store.set(defaultSettings);
		settings = defaultSettings;
	} else if (settings.shareData.behavior !== 0 && !forceLocal) {
		store = new Store({ cwd: settings.shareData.location });
		settings = store.get(SETTINGS);
		if (!settings) {
			store.set(defaultSettings);
			settings = defaultSettings;
		}
	}
	return settings;
};

const setSettings = (path, value, forceLocal = false) => {
	if (forceLocal) store = new Store({ cwd: app.getPath('userData') });
	else setStorageLocation();
	store.set(path, value);
	return store.get(path);
};

const copyLocalToNetwork = () => {
	const localMappings = getProviderMappings(true);
	const localTemplates = getMessageTemplates(true);
	const networkMappings = getProviderMappings();
	const networkTemplates = getMessageTemplates();
	let allMappingsAndTemplatesCopied = true;

	localMappings.forEach(mapping => {
		const existingMapping = networkMappings.filter(provider => provider.source === mapping.source).length > 0;
		if (existingMapping) {
			allMappingsAndTemplatesCopied = false;
		} else {
			addProviderMapping(mapping);
		}
	});

	localTemplates.forEach(template => {
		const existingTemplate = networkTemplates.filter(networkTemplate => networkTemplate.name === template.name).length > 0;
		if (existingTemplate) {
			allMappingsAndTemplatesCopied = false;
		} else {
			addMessageTemplate(template);
		}
	});

	return allMappingsAndTemplatesCopied;
};

module.exports = {
	getProviderMappings,
	addProviderMapping,
	removeProviderMappingWithSource,
	getMessageTemplates,
	addMessageTemplate,
	removeMessageTemplateWithName,
	getSettings,
	setSettings,
	copyLocalToNetwork
};
