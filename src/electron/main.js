/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

const projectPackage = require('../../package.json');
const { open, save } = require('./utilities/fileOpener');
const filePicker = require('./utilities/filePicker');
const persistentStorage = require('./utilities/persistentStorage');
const excelHelper = require('./utilities/excelHelper');

const {
	dialog, app, BrowserWindow, Menu, shell, ipcMain: ipc
} = electron;
let mainWindow;
let sending = false;

const isMac = process.platform === 'darwin';
const menuTemplate = [
	// { role: 'appMenu' }
	...(isMac ? [{
		label: app.name,
		submenu: [
			{ role: 'about' },
			{ type: 'separator' },
			{ role: 'hide' },
			{ role: 'hideothers' },
			{ role: 'unhide' },
			{ type: 'separator' },
			{ role: 'quit' }
		]
	}] : []),
	// { role: 'fileMenu' }
	{
		label: 'File',
		submenu: [
			isMac ? { role: 'close' } : { role: 'quit' }
		]
	},
	// { role: 'editMenu' }
	{
		label: 'Edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			...(isMac ? [
				{ role: 'delete' },
				{ role: 'selectAll' },
				{ type: 'separator' },
				{
					label: 'Speech',
					submenu: [
						{ role: 'startSpeaking' },
						{ role: 'stopSpeaking' }
					]
				}
			] : [
				{ role: 'delete' },
				{ type: 'separator' },
				{ role: 'selectAll' }
			])
		]
	},
	// { role: 'viewMenu' }
	{
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'forceReload' },
			{ role: 'toggleDevTools' },
			{ type: 'separator' },
			{ role: 'resetZoom' },
			{ role: 'zoomIn' },
			{ role: 'zoomOut' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' }
		]
	},
	// { role: 'windowMenu' }
	{
		label: 'Window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'zoom' },
			...(isMac ? [
				{ type: 'separator' },
				{ role: 'front' },
				{ type: 'separator' },
				{ role: 'window' }
			] : [
				{ role: 'close' }
			])
		]
	},
	{
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click: async () => {
					await shell.openExternal('http://convalesce.health');
				}
			}
		]
	}
];
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

const selectionMenu = Menu.buildFromTemplate([
	{ role: 'copy' },
	{ type: 'separator' },
	{ role: 'selectall' }
]);

const inputMenu = Menu.buildFromTemplate([
	{ role: 'cut' },
	{ role: 'copy' },
	{ role: 'paste' },
	{ type: 'separator' },
	{ role: 'selectall' }
]);

// Alert Window
const showAlert = (title, message, type, buttons, defaultId, cancelId) => dialog.showMessageBox({
	browserWindow: mainWindow,
	title,
	type,
	buttons,
	message: title,
	defaultId,
	cancelId,
	detail: message
});

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

	mainWindow.webContents.on('context-menu', (e, props) => {
		const { selectionText, isEditable } = props;
		if (isEditable) {
			inputMenu.popup(mainWindow);
		} else if (selectionText && selectionText.trim() !== '') {
			selectionMenu.popup(mainWindow);
		}
	});

	mainWindow.on('close', async e => {
		if (sending) {
			e.preventDefault();
			if ((await showAlert(
				'Sending in Progress',
				'Closing PaCom while sending will result in some messages not being sent and other potential data loss.',
				'warning',
				['Close Anyway', 'Cancel'],
				1,
				1
			)).response === 0) {
				mainWindow.destroy();
			}
		}
	});

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

ipc.handle('save-file', (event, filePath, fileName, file) => save(filePath, fileName, file));

ipc.handle('request-version', () => (projectPackage ? projectPackage.version : null));

ipc.handle('get-dynamic-values', (event, includeDefault = true) => persistentStorage.getDynamicValues(false, includeDefault));

ipc.handle('add-dynamic-value', (event, value, includeDefault) => persistentStorage.addDynamicValue(value, includeDefault));

ipc.handle('remove-dynamic-value', (event, valueName, includeDefault) => persistentStorage.removeDynamicValueWithName(valueName, includeDefault));

ipc.handle('get-provider-mappings', () => persistentStorage.getProviderMappings());

ipc.handle('add-provider-mapping', (event, mapping) => persistentStorage.addProviderMapping(mapping));

ipc.handle('remove-provider-mapping', (event, providerSource) => persistentStorage.removeProviderMappingWithSource(providerSource));

ipc.handle('get-message-templates', () => persistentStorage.getMessageTemplates());

ipc.handle('add-message-template', (event, template) => persistentStorage.addMessageTemplate(template));

ipc.handle('remove-message-template', (event, templateName) => persistentStorage.removeMessageTemplateWithName(templateName));

ipc.handle('get-settings', (event, forceLocal = false) => persistentStorage.getSettings(forceLocal));

ipc.handle('set-settings', (event, settingsPath, value, forceLocal = false) => persistentStorage.setSettings(settingsPath, value, forceLocal));

ipc.handle('open-folder-dialog', () => filePicker.pickFolder());

ipc.handle('save-file-dialog', (event, fileName) => filePicker.pickSave(fileName));

ipc.handle('copy-local-to-network', () => persistentStorage.copyLocalToNetwork());

ipc.handle('show-alert', (event, title, message, type, buttons, defaultId, cancelId) => showAlert(title, message, type, buttons, defaultId, cancelId));

ipc.handle('export-report', (event, report, autoSavePath) => excelHelper.exportMessageReport(report, autoSavePath));

ipc.handle('sending', (event, isSending) => { sending = isSending; });
