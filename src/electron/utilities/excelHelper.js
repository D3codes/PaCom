const ExcelJS = require('exceljs');
const filePicker = require('./filePicker');

const importXLSX = async (filePath = null) => {
	const workbook = new ExcelJS.Workbook();
	if (!filePath) {
		const filter = [{ name: 'XLSX', extensions: ['xlsx'] }];
		return new Promise(resolve => filePicker.pick(filter).then(path => {
			if (!path) return;
			workbook.xlsx.readFile(path).then(values => {
				const rows = [];
				values.worksheets[0].eachRow(row => {
					rows.push(JSON.stringify(row.values));
				});

				resolve({ path, data: rows });
			});
		}));
	}
	return new Promise(resolve => workbook.xlsx.readFile(filePath).then(values => {
		const rows = [];
		values.worksheets[0].eachRow(row => {
			rows.push(JSON.stringify(row.values));
		});

		resolve({ path: filePath, data: rows });
	}));
};

const exportMessageReport = async (report, autoSavePath = null) => {
	let path = autoSavePath;
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
	Object.values(report).forEach(reminders => {
		let appointmentDate = 'Unknown Date';
		if (reminders[0]?.appointment?.date) {
			const date = new Date(reminders[0].appointment.date);
			appointmentDate = `${date.getMonth() + 1}${date.getDate()}${date.getFullYear().toString().substr(-2)}`;
		}
		const worksheetName = `${reminders[0]?.appointment?.provider?.target || 'Unmapped Provider(s)'} - ${appointmentDate}`;
		const worksheet = workbook.addWorksheet(worksheetName, sheetProps);
		worksheet.columns = [
			{ header: 'Status', key: 'status', width: 10 },
			{ header: 'Appt Date', key: 'apptDate', width: 16 },
			{ header: 'Appt Time', key: 'apptTime', width: 11 },
			{ header: 'Procedure', key: 'procedure', width: 11 },
			{ header: 'Patient', key: 'patient', width: 20 },
			{ header: 'Account', key: 'account', width: 9 },
			{ header: 'Notify By', key: 'notify', width: 8 },
			{ header: 'Home', key: 'home', width: 13 },
			{ header: 'Cell', key: 'cell', width: 13 },
			{ header: 'Information', key: 'info', width: 25 }
		];

		reminders.forEach(reminder => {
			worksheet.addRow({
				status: reminder?.status,
				apptDate: reminder?.appointment?.date,
				apptTime: reminder?.appointment?.time,
				procedure: reminder?.appointment?.procedure?.source,
				patient: reminder?.patient?.name,
				account: reminder?.patient?.accountNumber,
				notify: reminder?.patient?.preferredContactMethod,
				home: reminder?.patient?.contactMethods?.find(contactMethod => contactMethod.type === 'Home')?.phoneNumber,
				cell: reminder?.patient?.contactMethods?.find(contactMethod => contactMethod.type === 'Cell')?.phoneNumber,
				info: reminder?.statusMessage
			});
		});
	});

	const fileName = `PaComMessageReport-${
		new Date()
			.toLocaleString()
			.replaceAll(':', '')
			.replaceAll('/', '')
			.replaceAll(' ', '')
			.replaceAll(',', '-')
	}.xlsx`;
	if (!path) path = await filePicker.pickSave(fileName);
	else path = `${path}\\${fileName}`;
	if (path) workbook.xlsx.writeFile(path);
};

module.exports = {
	importXLSX,
	exportMessageReport
};
