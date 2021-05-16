import { VersionNotFoundException } from '../errors/exceptions';

const getVersion = () => window.ipcRenderer.invoke('request-version').then((version, error) => {
	if (version) return version;
	throw VersionNotFoundException(error);
});

const getIsDev = () => window.ipcRenderer.invoke('is-dev');

export default {
	getVersion,
	getIsDev
};
