import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { Save, SaveAlt, Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import BrowseFile from '../browseFile';
import persistentStorage from '../../utilities/persistentStorage';
import folderSelector from '../../utilities/folderSelector';
import DescriptiveIconButton from '../descriptiveIconButton';

const useStyles = makeStyles(theme => ({
	root: {
		height: '100%'
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		height: `calc(100% - ${theme.spacing(3)}px)`
	},
	actionButtonContainer: {
		display: 'flex',
		justifyContent: 'flex-end'
	}
}));

export default function MessageReportSettings({ messageReports, hasWritePermission, reloadSettings }) {
	const classes = useStyles();
	const [autoSave, setAutoSave] = useState(messageReports.autosaveReports);
	const [location, setLocation] = useState(messageReports.autosaveLocation);

	const changesToSave = (location.trim() !== messageReports.autosaveLocation) || (autoSave !== messageReports.autosaveReports);
	const autoSaveOnAndLocationNotSet = autoSave && !location;

	const handleSave = () => {
		if (autoSave !== messageReports.autosaveReports) persistentStorage.setMessageReportsAutosave(autoSave);
		if (location.trim() !== messageReports.autosaveLocation) persistentStorage.setMessageReportsAutosaveLocation(location.trim());
		reloadSettings();
	};

	const browseForFolder = () => {
		folderSelector.getFolder().then(folderPath => setLocation(folderPath));
	};

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<BrowseFile
					onBrowseClick={browseForFolder}
					label="Message Report AutoSave Location"
					filePath={location}
					error={autoSaveOnAndLocationNotSet}
					helperText={autoSaveOnAndLocationNotSet ? 'A location must be selected for the message reports' : ''}
					disabled={!hasWritePermission || !autoSave}
					required={autoSave}
					onFilePathChange={setLocation}
				/>
				<DescriptiveIconButton
					onClick={() => { setAutoSave(false); }}
					selected={!autoSave}
					title="OFF"
					description="Do not AutoSave message reports after sending."
					Icon={Close}
					disabled={!hasWritePermission}
				/>
				<DescriptiveIconButton
					onClick={() => { setAutoSave(true); }}
					selected={autoSave}
					title="AUTOSAVE"
					description="AutoSave message reports to the specified location after sending is complete."
					Icon={SaveAlt}
					disabled={!hasWritePermission}
				/>
			</div>
			<div className={classes.actionButtonContainer}>
				<Button
					disabled={!hasWritePermission || !changesToSave || autoSaveOnAndLocationNotSet}
					endIcon={<Save />}
					color="primary"
					variant={changesToSave && !autoSaveOnAndLocationNotSet ? 'contained' : 'outlined'}
					onClick={handleSave}>
					Save
				</Button>
			</div>
		</div>
	);
}

MessageReportSettings.propTypes = {
	messageReports: PropTypes.shape(
		{
			autosaveReports: PropTypes.bool,
			autosaveLocation: PropTypes.string,
			lastReport: PropTypes.string
		}.isRequired
	),
	hasWritePermission: PropTypes.bool.isRequired,
	reloadSettings: PropTypes.func.isRequired
};
