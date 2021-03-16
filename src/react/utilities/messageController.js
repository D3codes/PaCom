const showInfo = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'info', ['OK'], 0, 0);

const showError = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'error', ['OK'], 0, 0);

const showWarning = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'warning', ['OK'], 0, 0);

const showWarningWithContinue = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'warning', ['Continue', 'Cancel'], 0, 1);

const showQuestion = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'question', ['OK', 'Cancel'], 0, 1);

const confirmDelete = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'warning', ['Delete', 'Cancel'], 0, 1);

const confirmSave = (title, message) => window.ipcRenderer.invoke('show-alert', title, message, 'warning', ['Save', 'Cancel'], 0, 1);

export default {
	showInfo,
	showError,
	showWarning,
	showWarningWithContinue,
	showQuestion,
	confirmDelete,
	confirmSave
};
