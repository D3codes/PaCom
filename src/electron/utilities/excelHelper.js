const ExcelJS = require('exceljs');
const filePicker = require('./filePicker');

const createWorkbook = async () => {
	const workbook = new ExcelJS.Workbook();
	workbook.creator = 'PaCom';
	workbook.created = new Date();
	workbook.modified = new Date();

	workbook.views = [
		{
			x: 0,
			y: 0,
			width: 10000,
			height: 20000,
			firstSheet: 0,
			activeTab: 1,
			visibility: 'visible'
		}
	];

	const sheetProps = { properties: { tabColor: { argb: '009BE5' } } };

	workbook.addWorksheet('Dr. Brown', sheetProps);
	workbook.addWorksheet('Dr. Samuelson', sheetProps);
	workbook.addWorksheet('Dr. Sonnenschein', sheetProps);

	workbook.eachSheet(worksheet => {
		// eslint-disable-next-line no-param-reassign
		worksheet.columns = [
			{ header: 'Status', key: 'status' },
			{ header: 'Time', key: 'time' },
			{ header: 'Duration', key: 'duration' },
			{ header: 'Patient', key: 'patient' },
			{ header: 'Account', key: 'account' },
			{ header: 'DOB', key: 'dob' },
			{ header: 'Notify By', key: 'notify' },
			{ header: 'Home', key: 'home' },
			{ header: 'Cell', key: 'cell' },
			{ header: 'Description', key: 'description' }
		];
	});

	// TODO: Add time to file name
	const path = await filePicker.pickSave(`PaComMessageReport-${new Date().toISOString().slice(0, 10)}.xlsx`);
	if (path) workbook.xlsx.writeFile(path);
};

module.exports = {
	createWorkbook
};
