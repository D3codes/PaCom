import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core';

import BrowseFile from '../browseFile';
import ReportTable from '../reportTable/reportTable';

import csvImporter from '../../utilities/csvImporter';
import usePromise from '../../hooks/usePromise';

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

const useReminders = (transformer) => {
	const [refreshId, setRefreshId] = useState(null);
	const refresh = useCallback(() => {
		setRefreshId(Symbol('reminders'));
	}, []);
	const [reminders] = usePromise(() => {
		if (refreshId === null || !transformer) return Promise.resolve(null);
		return csvImporter.getCSV().then(transformer);
	}, [refreshId, transformer]);
	return [reminders, refresh];
};

function AppointmentReminders() {
	const classes = useStyles();
	const [reminders, refreshReminders] = useReminders(transformersByEhr[selectedEhr]);
	return (
		<div className={classes.appointmentRemindersContainer}>
			<BrowseFile onBrowseClick={refreshReminders} />
			<ReportTable reminders={reminders} />
		</div>
	);
}

export default AppointmentReminders;
