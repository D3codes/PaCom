// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer: ipc } = require('electron');

class VersionNotFoundError extends Error {
	constructor() {
		super('Unable to find version for package');
	}
}

const getVersion = () => {
	ipc.send('request-version');
	return new Promise((resolve, reject) => {
		ipc.on('version', (event, version) => {
			if (version) resolve(version);
			else reject(new VersionNotFoundError());
		});
	});
};

export default getVersion;
