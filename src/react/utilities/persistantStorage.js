const getProviderMappings = () => {
	window.ipcRenderer.send('get-provider-mappings');
	return new Promise((resolve, reject) => {
		window.ipcRenderer.on('provider-mappings', (event, mappings) => {
			if (mappings) {
				resolve(mappings);
			} else {
				reject();
			}
		});
	});
};

const addProviderMapping = (provider) => {
	window.ipcRenderer.send('add-provider-mapping', provider);
};

const removeProviderMappingWithSource = (providerSource) => {
	window.ipcRenderer.send('remove-provider-mapping', providerSource);
};

const getMessageTemplates = () => {
	window.ipcRenderer.send('get-message-templates');
	return new Promise((resolve, reject) => {
		window.ipcRenderer.on('message-templates', (event, templates) => {
			if (templates) {
				resolve(templates);
			} else {
				reject();
			}
		});
	});
};

const addMessageTemplate = (template) => {
	window.ipcRenderer.send('add-message-template', template);
};

const removeMessageTemplateWithName = (templateName) => {
	window.ipcRenderer.send('remove-message-template', templateName);
};

export default {
	getProviderMappings,
	addProviderMapping,
	removeProviderMappingWithSource,
	getMessageTemplates,
	addMessageTemplate,
	removeMessageTemplateWithName
};
