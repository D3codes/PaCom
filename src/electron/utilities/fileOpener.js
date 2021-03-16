const fs = require('fs');
const { pick, pickSave } = require('./filePicker');

const open = async (filters, filePath) => {
	if (!filePath) {
		return new Promise((resolve, reject) => pick(filters, filePath).then(path => {
			fs.readFile(path, (err, data) => {
				if (err) {
					reject(err);
				}
				resolve({ path, data: data.toString() });
			});
		}));
	}
	return new Promise((resolve, reject) => fs.readFile(filePath, (err, data) => {
		if (err) {
			reject(err);
		}
		resolve({ path: filePath, data: data.toString() });
	}));
};

const save = (filePath, fileName, file) => {
	if (!filePath) {
		pickSave(fileName).then(path => {
			if (path) fs.writeFileSync(path, file);
		});
	} else {
		fs.writeFileSync(filePath, file);
	}
};

exports.open = open;
exports.save = save;
