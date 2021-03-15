const showInfo = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'info', ['OK'], 0, 0);

const showWarning = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'warning', ['OK', 'Cancel'], 0, 1);

export default {
	showInfo,
	showWarning
};
