import { VersionNotFoundException } from '../exceptions';

const getVersion = () => window.ipcRenderer.invoke('request-version').then((version, error) => {
	if (version) return version;
	throw VersionNotFoundException(error);
});

export default getVersion;
