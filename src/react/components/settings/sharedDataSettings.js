import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
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
		marginTop: '2em',
		marginBottom: '2em'
	},
	actionButtonContainer: {
		display: 'flex',
		justifyContent: 'flex-end'
	}
}));

export default function SharedDataSettings({ sharedData, reloadSettings }) {
	const classes = useStyles();
	const [changesToSave, setChangesToSave] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);

	const handleSave = () => {

	};

	return (
		<div className={classes.root}>
			<BrowseFile label="Shared Data Location" />
			<div className={classes.content}>
				<Button
					className={classes.button}
					color="primary"
					variant="outlined"
					style={{ textAlign: 'left' }}
					startIcon={<DesktopWindows />}>
					<div className={classes.buttonContent}>
						<Typography variant="h5">Local</Typography>
						<Typography>Read and Write all message templates, provider mappings, and settings locally.</Typography>
					</div>
				</Button>
				<Button
					className={classes.button}
					color="primary"
					variant="outlined"
					style={{ textAlign: 'left' }}
					startIcon={<Storage />}>
					<div className={classes.buttonContent}>
						<Typography variant="h5">Network - Ready Only</Typography>
						<Typography>Read all message templates, provider mappings, and settings from a network location.</Typography>
					</div>
				</Button>
				<Button
					className={classes.button}
					color="primary"
					variant="outlined"
					style={{ textAlign: 'left' }}
					startIcon={<Storage />}>
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
