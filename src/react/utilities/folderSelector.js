const getFolder = () => window.ipcRenderer.invoke('open-folder-dialog');

const saveFile = fileName => window.ipcRenderer.invoke('save-file-dialog', fileName);

const save = (filePath, fileName, file) => window.ipcRenderer.invoke('save-file', filePath, fileName, file);

export default {
	getFolder,
	saveFile,
	save
};
