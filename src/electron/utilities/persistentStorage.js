// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const Store = require('electron-store');
const isDev = require('electron-is-dev');
const defaultSettings = isDev
	? require('../models/devSettings.json')
	: require('../models/defaultSettings.json');

let store = new Store();

const DYNAMIC_VALUES = 'dynamicValues';
const PROVIDER_MAPPINGS = 'providerMappings';
const PROCEDURE_MAPPINGS = 'procedureMappings';
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

const getDynamicValues = (forceLocal = false) => {
	if (forceLocal) store = new Store({ cwd: app.getPath('userData') });
	else setStorageLocation();
	const values = store.get(DYNAMIC_VALUES);
	return values || [];
};

const removeDynamicValueWithName = valueName => {
	setStorageLocation();
	let values = getDynamicValues(false, false);
	if (!values) return [];
	values = values.filter(value => value.name !== valueName);
	store.set(DYNAMIC_VALUES, values);
	return getDynamicValues(false);
};

const addDynamicValue = value => {
	if (value.fromApptList) return getDynamicValues();
	setStorageLocation();
	const values = removeDynamicValueWithName(value.name, false);
	values.push(value);
	store.set(DYNAMIC_VALUES, values);
	return getDynamicValues(false);
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
	providers.unshift(provider);
	store.set(PROVIDER_MAPPINGS, providers);
	return getProviderMappings();
};

const getProcedureMappings = (forceLocal = false) => {
	if (forceLocal) store = new Store({ cwd: app.getPath('userData') });
	else setStorageLocation();
	const procedures = store.get(PROCEDURE_MAPPINGS);
	return procedures || [];
};

const removeProcedureMappingWithSource = procedureSource => {
	setStorageLocation();
	let procedures = getProcedureMappings();
	if (!procedures) return [];
	procedures = procedures.filter(procedure => procedure.source !== procedureSource);
	store.set(PROCEDURE_MAPPINGS, procedures);
	return getProcedureMappings();
};

const addProcedureMapping = procedure => {
	setStorageLocation();
	const procedures = removeProcedureMappingWithSource(procedure.source);
	procedures.unshift(procedure);
	store.set(PROCEDURE_MAPPINGS, procedures);
	return getProcedureMappings();
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
			settings = getSettings();
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
	const localProviderMappings = getProviderMappings(true);
	const localProcedureMappings = getProcedureMappings(true);
	const localTemplates = getMessageTemplates(true);
	const localDynamicValues = getDynamicValues(true, false);
	const networkProviderMappings = getProviderMappings();
	const networkProcedureMappings = getProcedureMappings();
	const networkTemplates = getMessageTemplates();
	const networkDynamicValues = getDynamicValues(false, false);
	let allDataCopied = true;

	localProviderMappings.forEach(mapping => {
		const existingMapping = networkProviderMappings.filter(provider => provider.source === mapping.source).length > 0;
		if (existingMapping) {
			allDataCopied = false;
		} else {
			addProviderMapping(mapping);
		}
	});

	localProcedureMappings.forEach(mapping => {
		const existingMapping = networkProcedureMappings.filter(procedure => procedure.source === mapping.source).length > 0;
		if (existingMapping) {
			allDataCopied = false;
		} else {
			addProcedureMapping(mapping);
		}
	});

	localTemplates.forEach(template => {
		const existingTemplate = networkTemplates.filter(networkTemplate => networkTemplate.name === template.name).length > 0;
		if (existingTemplate) {
			allDataCopied = false;
		} else {
			addMessageTemplate(template);
		}
	});

	localDynamicValues.forEach(value => {
		const existingValue = networkDynamicValues.filter(networkValue => networkValue.name === value.name).length > 0;
		if (existingValue) {
			allDataCopied = false;
		} else {
			addDynamicValue(value);
		}
	});

	return allDataCopied;
};

module.exports = {
	getDynamicValues,
	addDynamicValue,
	removeDynamicValueWithName,
	getProviderMappings,
	addProviderMapping,
	removeProviderMappingWithSource,
	getProcedureMappings,
	removeProcedureMappingWithSource,
	addProcedureMapping,
	getMessageTemplates,
	addMessageTemplate,
	removeMessageTemplateWithName,
	getSettings,
	setSettings,
	copyLocalToNetwork
};
