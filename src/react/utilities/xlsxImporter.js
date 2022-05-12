import { InvalidFileTypeException } from '../errors/exceptions';

const getXLSX = (filePath = null) => {
	if (filePath) {
		if (!filePath.endsWith('.xlsx')) throw new InvalidFileTypeException(`Invalid File Type - expected:.xlsx received:${filePath}`);
		return window.ipcRenderer.invoke('import-xlsx', filePath).then(({ path, data }) => ({ path, result: data }));
	}
	return window.ipcRenderer.invoke('import-xlsx').then(({ path, data }) => ({ path, result: data }));
};

export default {
	getXLSX
};
