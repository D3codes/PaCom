const showInfo = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'info', ['OK'], 0, 0);

const showWarning = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'warning', ['Continue', 'Cancel'], 0, 1);

const showQuestion = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'question', ['OK', 'Cancel'], 0, 1);

export default {
	showInfo,
	showWarning,
	showQuestion
};
