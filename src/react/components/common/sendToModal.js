import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Typography
} from '@material-ui/core';
import { Save, Undo } from '@material-ui/icons';

import Provider from '../../models/provider';
import Procedure from '../../models/procedure';

import SendTo from './sendTo';

const useStyles = makeStyles(theme => ({
	dialogTitle: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.secondary.contrastText
	},
	dialogContent: {
		'& > * + *': {
			marginTop: theme.spacing(2)
		},
		height: '550px',
		marginTop: theme.spacing(2)
	},
	dialogActions: {
		display: 'flex',
		justifyContent: 'space-between',
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
		marginBottom: theme.spacing()
	},
	sendToContainer: {
		height: '90%'
	}
}));

function SendToModal({
	onClose, procedures = null, providers = null, defaultProcedures, defaultProviders, forAppointmentReminders = false
}) {
	const classes = useStyles();

	const [procedureMappings, setProcedureMappings] = useState(procedures || defaultProcedures);
	const [providerMappings, setProviderMappings] = useState(providers || defaultProviders);

	const applyDefaultState = () => {
		setProcedureMappings(defaultProcedures);
		setProviderMappings(defaultProviders);
	};

	const mappingsMatch = (mapping1, mapping2) => {
		if (mapping1.length !== mapping2.length) return false;

		for (let i = 0; i < mapping1.length; i += 1) {
			if (forAppointmentReminders && !mapping2.some(x => (x.source === mapping1[i].source) && (x.sendToReminder === mapping1[i].sendToReminder))) return false;
			if (!forAppointmentReminders && !mapping2.some(x => (x.source === mapping1[i].source) && (x.sendToCustom === mapping1[i].sendToCustom))) return false;
		}

		return true;
	};

	const handleCancel = () => {
		onClose();
	};

	const handleSave = () => {
		onClose(procedureMappings, providerMappings);
	};

	const isSaveDisabled = (mappingsMatch(providerMappings, (providers || defaultProviders)) && mappingsMatch(procedureMappings, (procedures || defaultProcedures)));
	const isRestoreDefaultDisabled = (mappingsMatch(providerMappings, defaultProviders) && mappingsMatch(procedureMappings, defaultProcedures));

	return (
		<Dialog fullWidth open maxWidth="md">
			<DialogTitle className={classes.dialogTitle}>Send To</DialogTitle>
			<DialogContent className={classes.dialogContent}>
				<Typography className={classes.descriptionText}>
					Select which Providers and Procedures to send this message to.
				</Typography>
				<div className={classes.sendToContainer}>
					<SendTo
						providerMappings={providerMappings}
						procedureMappings={procedureMappings}
						onProvidersChange={setProviderMappings}
						onProceduresChange={setProcedureMappings}
						hasWritePermission
						forAppointmentReminders={forAppointmentReminders}
					/>
				</div>
			</DialogContent>
			<DialogActions className={classes.dialogActions}>
				<Button
					onClick={applyDefaultState}
					color="secondary"
					startIcon={<Undo />}
					variant={isRestoreDefaultDisabled ? 'outlined' : 'contained'}
					disabled={isRestoreDefaultDisabled}>
					Restore Defaults
				</Button>
				<div>
					<Button onClick={handleCancel} color="primary">Cancel</Button>
					<Button
						disabled={isSaveDisabled}
						endIcon={<Save />}
						onClick={handleSave}
						color="primary"
						variant={isSaveDisabled ? 'outlined' : 'contained'}>
						Save
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	);
}

SendToModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	procedures: PropTypes.arrayOf(PropTypes.instanceOf(Procedure)),
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider)),
	defaultProcedures: PropTypes.arrayOf(PropTypes.instanceOf(Procedure)).isRequired,
	defaultProviders: PropTypes.arrayOf(PropTypes.instanceOf(Provider)).isRequired,
	forAppointmentReminders: PropTypes.bool
};

export default SendToModal;
