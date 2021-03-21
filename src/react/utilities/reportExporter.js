const exportReport = report => window.ipcRenderer.invoke('export-report', report);

export default {
	exportReport
};
