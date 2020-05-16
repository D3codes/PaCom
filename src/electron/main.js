const electron = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const ipc = require('electron').ipcMain;
const projectPackage = require('../../package.json');
const open = require('./utilities/fileOpener');
// eslint-disable-next-line import/no-extraneous-dependencies
require('electron-reload');

const { app } = electron;
const { BrowserWindow } = electron;

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({ width: 1000, height: 900, webPreferences: { nodeIntegration: true } });
	mainWindow.setMenuBarVisibility(false);

	mainWindow.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../build/index.html')}`
	);

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	// Dev Tools
	mainWindow.webContents.openDevTools();
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
ipc.on('open-csv-dialog', async (event) => {
	const filter = [{ name: 'CSV', extensions: ['csv'] }];
	event.sender.send('selected-csv', await open(filter));
});

ipc.on('request-version', (event) => {
	event.sender.send('version', projectPackage ? projectPackage.version : null);
});
