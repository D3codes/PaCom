import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import {
	Save, DesktopWindows, Storage, FileCopy
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import BrowseFile from '../browseFile';
import persistentStorage from '../../utilities/persistentStorage';
import folderSelector from '../../utilities/folderSelector';
import AlertSnackBar from '../alertSnackbar';
import DescriptiveIconButton from '../descriptiveIconButton';

import { AllDataCopiedMessage, DuplicateDataNotCopiedMessage } from '../../localization/en/snackbarText';

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
		justifyContent: 'space-between'
	}
}));

const BEHAVIOR = {
	local: 0,
	networkReadOnly: 1,
	networkReadAndWrite: 2
};

export default function SharedConfigurationSettings({ sharedConfig, adminAccess, reloadSettings }) {
	const classes = useStyles();
	const [selectedOption, setSelectedOption] = useState(sharedConfig.behavior);
	const [location, setLocation] = useState(sharedConfig.location);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [showSnackbar, setShowSnackbar] = useState(false);
	const locationIsSpecifiedIfNetworkOptionSelected = useMemo(() => (
		selectedOption === BEHAVIOR.local || location
	), [location, selectedOption]);
	const changesToSave = useMemo(() => (
		selectedOption !== sharedConfig.behavior
		|| location !== sharedConfig.location
	), [selectedOption, location, sharedConfig]);

	const handleSave = () => {
		if (selectedOption !== sharedConfig.behavior) persistentStorage.setShareConfigBehavior(selectedOption);
		if (location !== sharedConfig.location) persistentStorage.setShareConfigLocation(location);
		reloadSettings();
	};

	const handleCopyToNetwork = () => {
		persistentStorage.copyLocalToNetwork().then(allMappingsAndTemplatesCopied => {
			if (allMappingsAndTemplatesCopied) {
				setSnackbarMessage(AllDataCopiedMessage);
			} else {
				setSnackbarMessage(DuplicateDataNotCopiedMessage);
			}
			setShowSnackbar(true);
		});
	};

	const browseForFolder = () => {
		folderSelector.getFolder().then(folderPath => setLocation(folderPath));
	};

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<BrowseFile
					onBrowseClick={browseForFolder}
					label="Shared Configuration Location"
					filePath={location}
					error={!locationIsSpecifiedIfNetworkOptionSelected}
					helperText={!locationIsSpecifiedIfNetworkOptionSelected ? 'A location must be selected for the shared configuration' : ''}
					disabled={selectedOption === BEHAVIOR.local}
					required={selectedOption !== BEHAVIOR.local}
					onFilePathChange={setLocation}
				/>
				<DescriptiveIconButton
					onClick={() => { setSelectedOption(BEHAVIOR.local); }}
					selected={selectedOption === BEHAVIOR.local}
					title="LOCAL"
					description="Read and Write all templates, mappings, dynamic values, and settings locally."
					Icon={DesktopWindows}
				/>
				<DescriptiveIconButton
					onClick={() => { setSelectedOption(BEHAVIOR.networkReadOnly); }}
					selected={selectedOption === BEHAVIOR.networkReadOnly}
					title="NETWORK - READ ONLY"
					description="Read all templates, mappings, dynamic values, and settings from a network location."
					Icon={Storage}
				/>
				{adminAccess && (
					<DescriptiveIconButton
						onClick={() => { setSelectedOption(BEHAVIOR.networkReadAndWrite); }}
						selected={selectedOption === BEHAVIOR.networkReadAndWrite}
						title="NETWORK - READ AND WRITE"
						description="Read and Write all templates, mappings, dynamic values, and settings from a network location."
						Icon={Storage}
					/>
				)}
			</div>
			<div className={classes.actionButtonContainer}>
				<Button
					disabled={sharedConfig.behavior !== 2 || !sharedConfig.location || !adminAccess}
					variant={sharedConfig.behavior !== 2 || !sharedConfig.location ? 'outlined' : 'contained'}
					color="secondary"
					onClick={handleCopyToNetwork}
					startIcon={<FileCopy />}>
					Copy Local to Network
				</Button>
				<Button
					disabled={!changesToSave || !locationIsSpecifiedIfNetworkOptionSelected}
					endIcon={<Save />}
					color="primary"
					variant={changesToSave && locationIsSpecifiedIfNetworkOptionSelected ? 'contained' : 'outlined'}
					onClick={handleSave}>
						Save
				</Button>
			</div>
			<AlertSnackBar
				severity={AlertSnackBar.Severities.Info}
				message={snackbarMessage}
				open={showSnackbar}
				onClose={() => { setShowSnackbar(false); }}
				autoHideDuration={5000}
			/>
		</div>
	);
}

SharedConfigurationSettings.propTypes = {
	sharedConfig: PropTypes.shape(
		{
			behavior: PropTypes.number,
			location: PropTypes.string
		}.isRequired
	),
	adminAccess: PropTypes.bool.isRequired,
	reloadSettings: PropTypes.func.isRequired
};
