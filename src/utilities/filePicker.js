const electron = require('electron');
const os = require('os');

const { dialog } = electron;

const pick = async (filters) => {
	if (os.platform() === 'linux' || os.platform() === 'win32') {
		return dialog.showOpenDialog({
			properties: ['openFile'],
			filters
		}).then((files) => {
			if (files) return files.filePaths[0];
			return '';
		});
	}

	return dialog.showOpenDialog({
		properties: ['openFile', 'openDirectory'],
		filters
	}).then((files) => {
		if (files) return files.filePaths[0];
		return '';
	});
};

module.exports = pick;
