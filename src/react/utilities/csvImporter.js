import Papa from 'papaparse';

const ipc = window.require('electron').ipcRenderer;

const parse = () => {
	ipc.send('open-csv-dialog');
	return new Promise((resolve, reject) => {
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
};

export default parse;
