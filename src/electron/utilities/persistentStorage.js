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

const getProviderMappings = () => {
	setStorageLocation();
	const providers = store.get(PROVIDER_MAPPINGS);
	return providers ? JSON.parse(providers) : [];
};

const removeProviderMappingWithSource = providerSource => {
	setStorageLocation();
	let providers = getProviderMappings();
	if (!providers) return [];
	providers = providers.filter(provider => provider.source !== providerSource);
	store.set(PROVIDER_MAPPINGS, JSON.stringify(providers));
	return getProviderMappings();
};

const addProviderMapping = provider => {
	setStorageLocation();
	const providers = removeProviderMappingWithSource(provider.source);
	providers.push(provider);
	store.set(PROVIDER_MAPPINGS, JSON.stringify(providers));
	return getProviderMappings();
};

const getMessageTemplates = () => {
	setStorageLocation();
	const templates = store.get(MESSAGE_TEMPLATES);
	return templates ? JSON.parse(templates) : [];
};

const addMessageTemplate = messageTemplate => {
	setStorageLocation();
	const templates = getMessageTemplates();
	templates.push(messageTemplate);
	store.set(MESSAGE_TEMPLATES, JSON.stringify(templates));
	return getMessageTemplates();
};

const removeMessageTemplateWithName = templateName => {
	setStorageLocation();
	let templates = getMessageTemplates();
	if (!templates) return [];
	templates = templates.filter(template => template.name !== templateName);
	store.set(MESSAGE_TEMPLATES, JSON.stringify(templates));
	return getMessageTemplates();
};

const getSettings = () => {
	store = new Store({ cwd: app.getPath('userData') });
	let settings = store.get(SETTINGS);
	if (!settings) {
		store.set(defaultSettings);
		settings = defaultSettings;
	} else if (settings.shareData.behavior !== 0) {
		store = new Store({ cwd: settings.shareData.location });
		settings = store.get(SETTINGS);
		if (!settings) {
			store.set(defaultSettings);
			settings = defaultSettings;
		}
	}
	return settings;
};

const getSharedConfigurationSettings = () => {
	store = new Store({ cwd: app.getPath('userData') });
	return store.get(SETTINGS).shareData;
};

const setSettings = (path, value, forceLocal = false) => {
	if (forceLocal) store = new Store({ cwd: app.getPath('userData') });
	else setStorageLocation();
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
	getSharedConfigurationSettings,
	setSettings
};
