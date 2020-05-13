const ipc = window.require('electron').ipcRenderer;

const parse = () => {
	const resolved = new Promise((resolve, reject) => {
		ipc.on('selected-csv', (event, path) => {
			if (path) {
				resolve(path);
			} else {
				reject();
			}
		});
	});

	ipc.send('open-csv-dialog');

	return resolved;
};

export default parse;
