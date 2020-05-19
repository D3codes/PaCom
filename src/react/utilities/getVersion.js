import { VersionNotFoundException } from '../exceptions';

const getVersion = () => {
	window.ipcRenderer.send('request-version');
	return new Promise((resolve, reject) => {
		window.ipcRenderer.on('version', (event, version) => {
			if (version) resolve(version);
			else reject(new VersionNotFoundException());
		});
	});
};

export default getVersion;
