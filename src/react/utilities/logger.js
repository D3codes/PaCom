const LOGGING_SEVERITIES = {
	Info: 0,
	Warning: 1,
	Error: 2
};

const logInfo = info => window.ipcRenderer.invoke('log', LOGGING_SEVERITIES.Info, info);

const logWarning = info => window.ipcRenderer.invoke('log', LOGGING_SEVERITIES.Warning, info);

const logError = info => window.ipcRenderer.invoke('log', LOGGING_SEVERITIES.Error, info);

export default {
	logInfo,
	logWarning,
	logError
};
