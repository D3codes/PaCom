import Papa from 'papaparse';

const ipc = window.require('electron').ipcRenderer;

const parse = () => {
	const resolved = new Promise((resolve, reject) => {
		ipc.on('selected-csv', (event, file) => {
			if (file) {
				Papa.parse(file, {
					complete: (results) => {
						resolve(results);
					}
				});
			} else {
				reject();
			}
		});
	});

	ipc.send('open-csv-dialog');

	return resolved;
};

export default parse;
