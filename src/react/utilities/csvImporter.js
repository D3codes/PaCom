import Papa from 'papaparse';

const parse = file => Papa.parse(file, {
	complete: results => results
});

const getCSV = () => window.ipcRenderer.invoke('open-csv-dialog').then(({ path, data }) => ({ path, result: parse(data) }));

export default {
	parse,
	getCSV
};
