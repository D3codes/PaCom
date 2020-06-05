import React, { useState, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Typography, Divider
} from '@material-ui/core';
import { Save, DesktopWindows, Storage } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import BrowseFile from '../browseFile';
import persistentStorage from '../../utilities/persistentStorage';
import folderSelector from '../../utilities/folderSelector';

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
		justifyContent: 'flex-end'
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
			/>
			<div className={classes.content}>
				<Button
					onClick={() => { setSelectedOption(BEHAVIOR.local); }}
					className={classes.button}
					color="primary"
					classes={{ root: classes.buttonRoot, outlinedPrimary: selectedOption === BEHAVIOR.local ? '' : classes.invisibleOutline }}
					variant="outlined"
					startIcon={(
						<Fragment>
							<DesktopWindows style={{ fontSize: '3rem', textAlign: 'left' }} />
							<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						</Fragment>
					)}>
					<div className={classes.buttonContent}>
						<Typography variant="h5">LOCAL</Typography>
						<Typography>Read and Write all message templates, provider mappings, and settings locally.</Typography>
					</div>
				</Button>
				<Button
					onClick={() => { setSelectedOption(BEHAVIOR.networkReadOnly); }}
					className={classes.button}
					color="primary"
					classes={{ root: classes.buttonRoot, outlinedPrimary: selectedOption === BEHAVIOR.networkReadOnly ? '' : classes.invisibleOutline }}
					variant="outlined"
					startIcon={(
						<Fragment>
							<Storage style={{ fontSize: '3rem', textAlign: 'left' }} />
							<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						</Fragment>
					)}>
					<div className={classes.buttonContent}>
						<Typography variant="h5">NETWORK - READ ONLY</Typography>
						<Typography>Read all message templates, provider mappings, and settings from a network location.</Typography>
					</div>
				</Button>
				<Button
					onClick={() => { setSelectedOption(BEHAVIOR.networkReadAndWrite); }}
					className={classes.button}
					color="primary"
					classes={{ root: classes.buttonRoot, outlinedPrimary: selectedOption === BEHAVIOR.networkReadAndWrite ? '' : classes.invisibleOutline }}
					variant="outlined"
					startIcon={(
						<Fragment>
							<Storage style={{ fontSize: '3rem', textAlign: 'left' }} />
							<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						</Fragment>
					)}>
					<div className={classes.buttonContent}>
						<Typography variant="h5">NETWORK - READ AND WRITE</Typography>
						<Typography>Read and Write all message templates, provider mappings, and settings from a network location.</Typography>
					</div>
				</Button>
			</div>
			<div className={classes.actionButtonContainer}>
				<Button
					disabled={!changesToSave || !locationIsSpecifiedIfNetworkOptionSelected}
					endIcon={<Save />}
					color="primary"
					variant={changesToSave && locationIsSpecifiedIfNetworkOptionSelected ? 'contained' : 'outlined'}
					onClick={handleSave}>
						Save
				</Button>
			</div>
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
