const getFolder = () => window.ipcRenderer.invoke('open-folder-dialog');

export default {
	getFolder
};
