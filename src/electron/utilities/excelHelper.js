const ExcelJS = require('exceljs');
const filePicker = require('./filePicker');

const exportMessageReport = async report => {
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
		const worksheet = workbook.addWorksheet(reminders[0]?.appointment?.provider?.target || 'Unmapped Provider(s)', sheetProps);
		worksheet.columns = [
			{ header: 'Status', key: 'status', width: 10 },
			{ header: 'Appt Date', key: 'apptDate', width: 16 },
			{ header: 'Appt Time', key: 'apptTime', width: 11 },
			{ header: 'Duration', key: 'duration', width: 7 },
			{ header: 'Patient', key: 'patient', width: 20 },
			{ header: 'Account', key: 'account', width: 9 },
			{ header: 'DOB', key: 'dob', width: 8 },
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
				duration: reminder?.appointment?.duration,
				patient: reminder?.patient?.name,
				account: reminder?.patient?.accountNumber,
				dob: reminder?.patient?.dateOfBirth,
				notify: reminder?.patient?.preferredContactMethod,
				home: reminder?.patient?.contactMethods?.find(contactMethod => contactMethod.type === 'Home')?.phoneNumber,
				cell: reminder?.patient?.contactMethods?.find(contactMethod => contactMethod.type === 'Cell')?.phoneNumber,
				info: reminder?.statusMessage
			});
		});
	});

	const path = await filePicker.pickSave(
		`PaComMessageReport-${
			new Date()
				.toLocaleString()
				.replaceAll(':', '')
				.replaceAll('/', '')
				.replaceAll(' ', '')
				.replaceAll(',', '-')
		}.xlsx`
	);
	if (path) workbook.xlsx.writeFile(path);
};

module.exports = {
	exportMessageReport
};
