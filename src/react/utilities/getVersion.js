class VersionNotFoundError extends Error {
	constructor() {
		super('Unable to find version for package');
	}
}

const getVersion = () => {
	window.ipcRenderer.send('request-version');
	return new Promise((resolve, reject) => {
		window.ipcRenderer.on('version', (event, version) => {
			if (version) resolve(version);
			else reject(new VersionNotFoundError());
		});
	});
};

export default getVersion;
