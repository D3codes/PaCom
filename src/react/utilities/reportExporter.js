const exportReport = (report, path = null) => window.ipcRenderer.invoke('export-report', report, path);

export default {
	exportReport
};
