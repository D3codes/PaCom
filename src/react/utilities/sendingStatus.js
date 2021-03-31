const update = isSending => window.ipcRenderer.invoke('sending', isSending);

export default {
	update
};
