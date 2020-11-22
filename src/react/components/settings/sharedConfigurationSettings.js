import React, { useState, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Typography, Divider
} from '@material-ui/core';
import {
	Save, DesktopWindows, Storage, FileCopy
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import BrowseFile from '../browseFile';
import persistentStorage from '../../utilities/persistentStorage';
import folderSelector from '../../utilities/folderSelector';
import AlertSnackBar from '../alertSnackbar';
import CustomButton from '../customButton';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	content: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column'
	},
	buttonContent: {
		display: 'flex',
		flexDirection: 'column'
	},
	button: {
		marginTop: theme.spacing(),
		marginBottom: theme.spacing()
	},
	actionButtonContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	adornmentDivider: {
		margin: theme.spacing()
	},
	buttonRoot: {
		textTransform: 'none',
		justifyContent: 'flex-start',
		textAlign: 'left'
	},
	invisibleOutline: {
		borderColor: 'rgba(0,0,0,0)',
		'&:hover': {
			borderColor: 'rgba(0,0,0,0)'
		}
	}
}));

const BEHAVIOR = {
	local: 0,
	networkReadOnly: 1,
	networkReadAndWrite: 2
};

export default function SharedConfigurationSettings({ sharedConfig, reloadSettings }) {
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
				setSnackbarMessage('Local mappings and templates copied to network');
			} else {
				setSnackbarMessage('Duplicate mappings or templates were not copied');
			}
			setShowSnackbar(true);
		});
	};

	const browseForFolder = () => {
		folderSelector.getFolder().then(folderPath => setLocation(folderPath));
	};

	return (
		<div className={classes.root}>
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
			<div className={classes.content}>
				<CustomButton
						onClick={() => {setSelectedOption(BEHAVIOR.local);}}
						selected={selectedOption === BEHAVIOR.local}
						title={"LOCAL"}
						description={"Read and Write all message templates, provider mappings, and settings locally."}
					>
						<DesktopWindows style={{ fontSize: '3rem', textAlign: 'left' }} />
				</CustomButton>
				<CustomButton
						onClick={() => {setSelectedOption(BEHAVIOR.networkReadOnly);}}
						selected={selectedOption === BEHAVIOR.networkReadOnly}
						title={"NETWORK - READ ONLY"}
						description={"Read all message templates, provider mappings, and settings from a network location."}
					>
						<Storage style={{ fontSize: '3rem', textAlign: 'left' }} />
				</CustomButton>
				<CustomButton
						onClick={() => {setSelectedOption(BEHAVIOR.networkReadAndWrite);}}
						selected={selectedOption === BEHAVIOR.networkReadAndWrite}
						title={"NETWORK - READ AND WRITE"}
						description={"Read and Write all message templates, provider mappings, and settings from a network location."}
					>
						<Storage style={{ fontSize: '3rem', textAlign: 'left' }} />
				</CustomButton>
			</div>
			<div className={classes.actionButtonContainer}>
				<Button
					disabled={sharedConfig.behavior !== 2 || !sharedConfig.location}
					variant={sharedConfig.behavior !== 2 || !sharedConfig.location ? 'outlined' : 'contained'}
					color="primary"
					onClick={handleCopyToNetwork}
					startIcon={<FileCopy />}>
					Copy local to network
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
				severity="info"
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
			SID: PropTypes.string,
			authToken: PropTypes.string,
			phoneNumber: PropTypes.string,
			callEndpoint: PropTypes.string,
			smsEndpoint: PropTypes.string
		}.isRequired
	),
	reloadSettings: PropTypes.func.isRequired
};
