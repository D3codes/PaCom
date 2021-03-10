/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

const projectPackage = require('../../package.json');
const open = require('./utilities/fileOpener');
const filePicker = require('./utilities/filePicker');
const persistentStorage = require('./utilities/persistentStorage');

const { app, BrowserWindow, ipcMain: ipc } = electron;
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 1200,
		minHeight: 800,
		title: 'PaCom',
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			preload: `${__dirname}/preload.js`
		}
	});
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
ipc.handle('open-csv-dialog', () => {
	const filter = [{ name: 'CSV', extensions: ['csv'] }];
	return open(filter);
});

ipc.handle('open-file', (event, filePath) => open([], filePath));

ipc.handle('request-version', () => (projectPackage ? projectPackage.version : null));

ipc.handle('get-provider-mappings', () => persistentStorage.getProviderMappings());

ipc.handle('add-provider-mapping', (event, mapping) => persistentStorage.addProviderMapping(mapping));

ipc.handle('remove-provider-mapping', (event, providerSource) => persistentStorage.removeProviderMappingWithSource(providerSource));

ipc.handle('get-message-templates', () => persistentStorage.getMessageTemplates());

ipc.handle('add-message-template', (event, template) => persistentStorage.addMessageTemplate(template));

ipc.handle('remove-message-template', (event, templateName) => persistentStorage.removeMessageTemplateWithName(templateName));

ipc.handle('get-settings', (event, forceLocal = false) => persistentStorage.getSettings(forceLocal));

ipc.handle('set-settings', (event, settingsPath, value, forceLocal = false) => persistentStorage.setSettings(settingsPath, value, forceLocal));

ipc.handle('open-folder-dialog', () => filePicker.pickFolder());

ipc.handle('copy-local-to-network', () => persistentStorage.copyLocalToNetwork());
