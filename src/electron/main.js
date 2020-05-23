/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

const projectPackage = require('../../package.json');
const open = require('./utilities/fileOpener');
const persistantStorage = require('./utilities/persistantStorage');

const { app, BrowserWindow, ipcMain: ipc } = electron;
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({ width: 1200, height: 800, webPreferences: { nodeIntegration: true, preload: `${__dirname}/preload.js` } });
	mainWindow.setMenuBarVisibility(false);

	mainWindow.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../index.html')}`
	);

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	// Dev Tools
	if (isDev) mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

// Listeners
ipc.on('open-csv-dialog', async event => {
	const filter = [{ name: 'CSV', extensions: ['csv'] }];
	event.sender.send('selected-csv', await open(filter));
});

ipc.on('request-version', event => {
	event.sender.send('version', projectPackage ? projectPackage.version : null);
});

ipc.on('get-provider-mappings', event => {
	event.sender.send('provider-mappings', persistantStorage.getProviderMappings());
});

ipc.on('add-provider-mapping', (event, mapping) => {
	persistantStorage.addProviderMapping(mapping);
});

ipc.on('remove-provider-mapping', (event, providerSource) => {
	persistantStorage.removeProviderMappingWithSource(providerSource);
});

ipc.on('get-message-templates', event => {
	event.sender.send('message-templates', persistantStorage.getMessageTemplates());
});

ipc.on('add-message-template', (event, template) => {
	persistantStorage.addMessageTemplate(template);
});

ipc.on('remove-message-template', (event, templateName) => {
	persistantStorage.removeMessageTemplateWithName(templateName);
});

ipc.on('get-settings', event => {
	event.sender.send('settings', persistantStorage.getSettings());
});

ipc.on('set-settings', (event, settingsPath, value) => {
	persistantStorage.setSettings(settingsPath, value);
});
