const ipc = window.require('electron').ipcRenderer;

const parse = () => {
	const resolved = new Promise((resolve, reject) => {
		ipc.on('selected-file', (event, path) => {
			if (path) {
				resolve(path);
			} else {
				reject();
			}
		});
	});

	ipc.send('open-file-dialog');

	return resolved;
};

export default parse;
