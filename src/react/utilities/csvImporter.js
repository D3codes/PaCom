import Papa from 'papaparse';

const parse = file => Papa.parse(file, {
	complete: results => results
});

const getCSV = () => window.ipcRenderer.invoke('open-csv-dialog');

export default {
	parse,
	getCSV
};
