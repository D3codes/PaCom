const fs = require('fs');
const pick = require('./filePicker');

const open = async filters => new Promise((resolve, reject) => {
	pick(filters).then(path => {
		fs.readFile(path, (err, data) => {
			if (err) {
				reject(err);
			}

			resolve({ path, data: data.toString() });
		});
	});
});

module.exports = open;
