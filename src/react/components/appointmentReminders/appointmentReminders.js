import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';

import BrowseFile from '../browseFile';
import ReportTable from '../reportTable/reportTable';

import csvImporter from '../../utilities/csvImporter';

// transformers
import fromPulse from '../../transformers/fromPulse';

const Ehrs = {
	Pulse: 'Pulse'
};

const transformersByEhr = {
	Pulse: fromPulse
};

const selectedEhr = Ehrs.Pulse;

const useStyles = makeStyles(() => ({
	appointmentRemindersContainer: {
		display: 'flex',
		flexFlow: 'column',
		height: '100%'
	}
}));

function AppointmentReminders() {
	const classes = useStyles();
	const [reminders, setReminders] = useState(null);
	const [filePath, setFilePath] = useState('');
	function handleBrowseClick() {
		const csvPromise = csvImporter.getCSV();
		csvPromise.then(({ data }) => transformersByEhr[selectedEhr](data.data)).then(setReminders);
		csvPromise.then(({ path }) => setFilePath(path));
	}
	return (
		<div className={classes.appointmentRemindersContainer}>
			<BrowseFile onBrowseClick={handleBrowseClick} filePath={filePath} />
			<ReportTable reminders={reminders} />
		</div>
	);
}

export default AppointmentReminders;
