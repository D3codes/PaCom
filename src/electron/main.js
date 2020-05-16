/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const open = require('./utilities/fileOpener');
// require('electron-reload'); /* Uncomment for local dev */

const { app, BrowserWindow, ipcMain: ipc } = electron;

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({ width: 1000, height: 900, webPreferences: { nodeIntegration: true } });
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
ipc.on('open-csv-dialog', async (event) => {
	const filter = [{ name: 'CSV', extensions: ['csv'] }];
	event.sender.send('selected-csv', await open(filter));
});
