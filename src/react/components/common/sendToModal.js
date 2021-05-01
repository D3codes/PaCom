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
	dialogContent: {
		'& > * + *': {
			marginTop: theme.spacing(2)
		},
		height: '550px'
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
	onSave, open = false, procedures, providers, forAppointmentReminders = false
}) {
	const classes = useStyles();

	const [procedureMappings, setProcedureMappings] = useState(procedures);
	const [providerMappings, setProviderMappings] = useState(providers);

	const applyInitialState = () => {
		setProcedureMappings(procedures);
		setProviderMappings(providers);
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
		applyInitialState();
		onSave();
	};

	const handleSave = () => {
		console.log('save');
		onSave(procedureMappings, providerMappings);
	};

	const isSaveDisabled = (mappingsMatch(providerMappings, providers) && mappingsMatch(procedureMappings, procedures));

	return (
		<Dialog fullWidth open={open} maxWidth="md">
			<DialogTitle>Send To</DialogTitle>
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
					onClick={applyInitialState}
					color="primary"
					startIcon={<Undo />}
					variant={isSaveDisabled ? 'outlined' : 'contained'}
					disabled={isSaveDisabled}>
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
	onSave: PropTypes.func.isRequired,
	open: PropTypes.bool,
	procedures: PropTypes.arrayOf(PropTypes.instanceOf(Procedure)).isRequired,
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider)).isRequired,
	forAppointmentReminders: PropTypes.bool
};

export default SendToModal;
