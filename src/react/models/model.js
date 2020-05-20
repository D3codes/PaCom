class Model {
	get(key, notSetValue = null) {
		const result = this[key];
		return result === undefined ? notSetValue : result;
	}

	getIn(path, notSetValue = null) {
		if (!Array.isArray(path)) return null;
		return path.reduce((key, value) => {
			const result = key[value];
			return result === undefined ? notSetValue : result;
		}, this);
	}
}

export default Model;
