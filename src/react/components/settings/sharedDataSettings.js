import React, { useState, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, Divider } from '@material-ui/core';
import { Save, DesktopWindows, Storage } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import BrowseFile from '../browseFile';
import persistentStorage from '../../utilities/persistentStorage';

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
	}
}));

const behavior = {
	local: 0,
	networkReadOnly: 1,
	networkReadAndWrite: 2
};

export default function SharedDataSettings({ sharedData, reloadSettings }) {
	const classes = useStyles();
	const [changesToSave, setChangesToSave] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);
	const [location, setLocation] = useState(null);
	const [enableLocation, setEnableLocation] = useState(false);

	const handleSave = () => {
		if (selectedOption !== sharedData.behavior) persistentStorage.setShareDataBehavior(selectedOption);
		if (location !== sharedData.location) persistentStorage.setShareDataLocation(location);
		reloadSettings();
	};

	return (
		<div className={classes.root}>
			<BrowseFile label="Shared Data Location" />
			<div className={classes.content}>
				<Button
					onClick={() => { setSelectedOption(0); setEnableLocation(false); }}
					className={classes.button}
					color="primary"
					variant={selectedOption === 0 ? 'outlined' : 'text'}
					style={{ textAlign: 'left' }}
					startIcon={(
						<Fragment>
							<DesktopWindows style={{ fontSize: '3rem', textAlign: 'left' }} />
							<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						</Fragment>
					)}>
					<div className={classes.buttonContent}>
						<Typography variant="h5">Local</Typography>
						<Typography>Read and Write all message templates, provider mappings, and settings locally.</Typography>
					</div>
				</Button>
				<Button
					onClick={() => { setSelectedOption(1); setEnableLocation(true); }}
					className={classes.button}
					color="primary"
					style={{ textAlign: 'left' }}
					variant={selectedOption === 1 ? 'outlined' : 'text'}
					startIcon={(
						<Fragment>
							<Storage style={{ fontSize: '3rem', textAlign: 'left' }} />
							<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						</Fragment>
					)}>
					<div className={classes.buttonContent}>
						<Typography variant="h5">Network - Ready Only</Typography>
						<Typography>Read all message templates, provider mappings, and settings from a network location.</Typography>
					</div>
				</Button>
				<Button
					onClick={() => { setSelectedOption(2); setEnableLocation(true); }}
					className={classes.button}
					color="primary"
					style={{ textAlign: 'left' }}
					variant={selectedOption === 2 ? 'outlined' : 'text'}
					startIcon={(
						<Fragment>
							<Storage style={{ fontSize: '3rem', textAlign: 'left' }} />
							<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						</Fragment>
					)}>
					<div className={classes.buttonContent}>
						<Typography variant="h5">Network - Read and Write</Typography>
						<Typography>Read and Write all message templates, provider mappings, and settings from a network location.</Typography>
					</div>
				</Button>
			</div>
			<div className={classes.actionButtonContainer}>
				<Button
					disabled={!changesToSave}
					endIcon={<Save />}
					color="primary"
					variant={changesToSave ? 'contained' : 'outlined'}
					onClick={handleSave}>
						Save
				</Button>
			</div>
		</div>
	);
}

SharedDataSettings.propTypes = {
	sharedData: PropTypes.shape(
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
