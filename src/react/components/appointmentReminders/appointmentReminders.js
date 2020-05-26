import React, { useState, Fragment } from 'react';
import { makeStyles, Typography, CircularProgress, Button } from '@material-ui/core';
import { SystemUpdateAlt } from '@material-ui/icons';
import { FileDrop } from 'react-file-drop';
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

const useStyles = makeStyles(theme => ({
	appointmentRemindersContainer: {
		display: 'flex',
		flexFlow: 'column',
		height: '100%'
	},
	fileDrop: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: 4,
		margin: theme.spacing(2, 0),
		transition: '200ms'
	},
	fileDropOver: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		border: `2px solid ${theme.palette.primary.main}`,
		borderRadius: 4,
		margin: theme.spacing(2, 0),
		boxShadow: `0 0 6px ${theme.palette.primary.main}`,
		transition: '200ms'
	},
	dragAndDropIcon: {
		alignSelf: 'center',
		fontSize: '5rem',
		color: theme.palette.text.secondary
	},
	dragAndDropIconOver: {
		alignSelf: 'center',
		fontSize: '5rem',
		color: theme.palette.primary.main
	},
	fileDropContent: {
		display: 'flex',
		flexFlow: 'column'
	}
}));

function AppointmentReminders() {
	const classes = useStyles();
	const [reminders, setReminders] = useState(null);
	const [filePath, setFilePath] = useState('');
	const [draggingOver, setDraggingOver] = useState(false);
	const [fileDropped, setFileDropped] = useState(false);

	const handleBrowseClick = () => {
		const csvPromise = csvImporter.getCSV();
		csvPromise.then(({ result }) => transformersByEhr[selectedEhr](result.data)).then(setReminders);
		csvPromise.then(({ path }) => setFilePath(path));
	};

	const handleFileDrop = files => {
		if (!files) return;
		setFileDropped(true);
		const droppedFilePath = files[0].path;
		const csvPromise = csvImporter.getCSV(droppedFilePath);
		csvPromise.then(({ result }) => transformersByEhr[selectedEhr](result.data)).then(setReminders);
		csvPromise.then(({ path }) => setFilePath(path));
	};

	const handleDragOver = () => {
		setDraggingOver(true);
	};

	const handleDragLeave = () => {
		setDraggingOver(false);
	};

	return (
		<div className={classes.appointmentRemindersContainer}>
			<BrowseFile onBrowseClick={handleBrowseClick} filePath={filePath} />
			{reminders
				? <ReportTable reminders={reminders} />
				: (
					<FileDrop
						onDrop={handleFileDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						className={draggingOver ? classes.fileDropOver : classes.fileDrop}>
						<div className={classes.fileDropContent}>
							{fileDropped
								? <CircularProgress />
								: (
									<Fragment>
										<SystemUpdateAlt className={draggingOver ? classes.dragAndDropIconOver : classes.dragAndDropIcon} />
										<Typography
											align="center"
											className={classes.noRemindersText}
											color={draggingOver ? 'primary' : 'textSecondary'}
											variant="subtitle1">
											<Button color="primary" onClick={handleBrowseClick}>Browse for a file</Button> or drag it here.
										</Typography>
									</Fragment>
								)}
						</div>
					</FileDrop>
				)}
		</div>
	);
}

export default AppointmentReminders;
