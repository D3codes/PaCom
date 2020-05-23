import Papa from 'papaparse';

const parse = file => Papa.parse(file, {
	complete: results => results
});

const getCSV = () => {
	window.ipcRenderer.send('open-csv-dialog');
	return new Promise((resolve, reject) => {
		window.ipcRenderer.on('selected-csv', (event, file) => {
			if (file) {
				resolve(parse(file));
			} else {
				reject();
			}
		});
	});
};

export default {
	parse,
	getCSV
};
