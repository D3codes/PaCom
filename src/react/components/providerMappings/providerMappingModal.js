import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, TextField
} from '@material-ui/core';
import { Save } from '@material-ui/icons';

import Provider from '../../models/provider';
import messageController from '../../utilities/messageController';

import {
	ProviderMappingSourceInUseTitle, ProviderMappingSourceInUseMessage,
	UpdateDyanmicValuesReminderTitle, UpdateDynamicValuesReminderMessage
} from '../../localization/en/alertDialog';

const useStyles = makeStyles(theme => ({
	dialogContent: {
		'& > * + *': {
			marginTop: theme.spacing(2)
		}
	}
}));

function ProviderMappingModal({
	onCancel, onSave, open = false, provider = null, providers = null
}) {
	const classes = useStyles();

	const [source, setSource] = useState('');
	const [target, setTarget] = useState('');
	const [phonetic, setPhonetic] = useState('');

	useEffect(() => {
		if (open && provider) {
			setSource(provider.source);
			setTarget(provider.target);
			setPhonetic(provider.phonetic);
		}
	}, [open, provider]);

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
		const existingProvider = !provider && providers?.find(prov => prov.source === source);
		if (existingProvider) {
			messageController.confirmSave(ProviderMappingSourceInUseTitle, ProviderMappingSourceInUseMessage).then(({ response }) => {
				if (response === 0) {
					const newProviderMapping = new Provider(source, target, phonetic);
					onSave(newProviderMapping, provider);
					applyInitialState();
				}
			});
		} else {
			const newProviderMapping = new Provider(source, target, phonetic);
			onSave(newProviderMapping, provider);
			applyInitialState();

			messageController.showInfo(UpdateDyanmicValuesReminderTitle, UpdateDynamicValuesReminderMessage);
		}
	};

	const isSaveDisabled = !(source && target && phonetic);

	return (
		<Dialog fullWidth open={open}>
			<DialogTitle>{provider ? 'Edit' : 'Add'} Provider Mapping</DialogTitle>
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

ProviderMappingModal.propTypes = {
	onCancel: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	open: PropTypes.bool,
	provider: PropTypes.instanceOf(Provider),
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider))
};

export default ProviderMappingModal;
