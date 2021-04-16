import Papa from 'papaparse';
import { InvalidFileTypeException } from '../errors/exceptions';

const parse = file => Papa.parse(file, {
	complete: results => results
});

const getCSV = (filePath = null) => {
	if (filePath) {
		if (!filePath.endsWith('.csv')) throw new InvalidFileTypeException(`Invalid File Type - expected:.csv received:${filePath}`);
		return window.ipcRenderer.invoke('open-file', filePath).then(({ path, data }) => ({ path, result: parse(data) }));
	}
	return window.ipcRenderer.invoke('open-csv-dialog').then(({ path, data }) => ({ path, result: parse(data) }));
};

export default {
	parse,
	getCSV
};
