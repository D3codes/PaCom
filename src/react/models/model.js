class Model {
	get(key, notSetValue = null) {
		const result = this[key];
		return result === undefined ? notSetValue : result;
	}

	getIn(path, notSetValue = null) {
		if (!Array.isArray(path)) return null;
		if (!path.length) return notSetValue;
		return path.reduce((object, key) => {
			if (object === null || object === undefined) return null;
			const result = object[key];
			return result === undefined ? notSetValue : result;
		}, this);
	}
}

export default Model;
