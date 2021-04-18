import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, TextField
} from '@material-ui/core';
import { Save } from '@material-ui/icons';

import Procedure from '../../models/procedure';

import { ProcedureMappingSourceInUseTitle, ProcedureMappingSourceInUseMessage } from '../../localization/en/dialogText';
import dialogController from '../../utilities/dialogController';

const useStyles = makeStyles(theme => ({
	dialogContent: {
		'& > * + *': {
			marginTop: theme.spacing(2)
		}
	}
}));

function ProcedureMappingModal({
	onCancel, onSave, open = false, procedure = null, procedures = null
}) {
	const classes = useStyles();

	const [source, setSource] = useState('');
	const [target, setTarget] = useState('');
	const [phonetic, setPhonetic] = useState('');

	useEffect(() => {
		if (open && procedure) {
			setSource(procedure.source);
			setTarget(procedure.target);
			setPhonetic(procedure.phonetic);
		}
	}, [open, procedure]);

	const applyInitialState = () => {
		setSource('');
		setTarget('');
		setPhonetic('');
	};

	const handleSourceChange = event => setSource(event.target.value);

	const handleTargetChange = event => setTarget(event.target.value);

	const handlePhoneticChange = event => setPhonetic(event.target.value);

	const handleCancel = () => {
		onCancel();
		applyInitialState();
	};

	const handleSave = () => {
		const existingProcedure = !procedure && procedures?.find(prov => prov.source === source);
		if (existingProcedure) {
			dialogController.confirmSave(ProcedureMappingSourceInUseTitle, ProcedureMappingSourceInUseMessage).then(({ response }) => {
				if (response === 0) {
					const newProcedureMapping = new Procedure(source, target, phonetic);
					onSave(newProcedureMapping, procedure);
					applyInitialState();
				}
			});
		} else {
			const newProcedureMapping = new Procedure(source, target, phonetic);
			onSave(newProcedureMapping, procedure);
			applyInitialState();
		}
	};

	const isSaveDisabled = !(source && target && phonetic);

	return (
		<Dialog fullWidth open={open}>
			<DialogTitle>{procedure ? 'Edit' : 'Add'} Procedure Mapping</DialogTitle>
			<DialogContent className={classes.dialogContent}>
				<TextField
					autoFocus
					fullWidth
					label="Source"
					onChange={handleSourceChange}
					placeholder="Source..."
					value={source}
				/>
				<TextField
					fullWidth
					label="SMS"
					onChange={handleTargetChange}
					placeholder="SMS..."
					value={target}
				/>
				<TextField
					fullWidth
					label="Phonetic"
					onChange={handlePhoneticChange}
					placeholder="Phonetic..."
					value={phonetic}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color="primary">Cancel</Button>
				<Button
					disabled={isSaveDisabled}
					endIcon={<Save />}
					onClick={handleSave}
					color="primary"
					variant={isSaveDisabled ? 'outlined' : 'contained'}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

ProcedureMappingModal.propTypes = {
	onCancel: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	open: PropTypes.bool,
	procedure: PropTypes.instanceOf(Procedure),
	procedures: PropTypes.arrayOf(PropTypes.instanceOf(Procedure))
};

export default ProcedureMappingModal;
