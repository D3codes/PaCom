const electron = require('electron');

const { app } = electron;
const isDev = require('electron-is-dev');

const { BrowserWindow, dialog } = electron;
require('electron-reload');
const path = require('path');
const os = require('os');

const ipc = require('electron').ipcMain;

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true } });

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

ipc.on('open-file-dialog', (event) => {
	if (os.platform() === 'linux' || os.platform() === 'win32') {
		console.log('6');
		dialog.showOpenDialog({
			properties: ['openFile']
		}).then((files) => {
			if (files) { event.sender.send('selected-file', files.filePaths[0]); console.log(files); } else console.log('5');
		});
	} else {
		console.log('7');
		dialog.showOpenDialog({
			properties: ['openFile', 'openDirectory']
		}, (files) => {
			if (files) { console.log('2'); event.sender.send('selected-file', files[0]); } else console.log('3');
		});
	}
});

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
