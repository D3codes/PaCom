class Model {
	get(key, notSetValue = null) {
		const result = this[key];
		return result === undefined ? notSetValue : result;
	}

	getIn(path, notSetValue = null) {
		if (!Array.isArray(path)) return null;
		if (!path.length) return notSetValue;
		return path.reduce((key, value) => {
			if (key === null || key === undefined) return null;
			const result = key[value];
			return result === undefined ? notSetValue : result;
		}, this);
	}
}

export default Model;
