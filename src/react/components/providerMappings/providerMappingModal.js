import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles
} from '@material-ui/core';
import {
	Save, Input, Sms, Phone
} from '@material-ui/icons';

import Provider from '../../models/provider';

import {
	ProviderMappingSourceInUseTitle, ProviderMappingSourceInUseMessage
} from '../../localization/en/dialogText';
import dialogController from '../../utilities/dialogController';
import IconTextField from '../iconTextField';

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
			dialogController.confirmSave(ProviderMappingSourceInUseTitle, ProviderMappingSourceInUseMessage).then(({ response }) => {
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
		}
	};

	const isSaveDisabled = !(source && target && phonetic);

	return (
		<Dialog fullWidth open={open}>
			<DialogTitle>{provider ? 'Edit' : 'Add'} Provider Mapping</DialogTitle>
			<DialogContent className={classes.dialogContent}>
				<IconTextField
					autoFocus
					label="Source"
					onChange={handleSourceChange}
					value={source}
					Icon={Input}
				/>
				<IconTextField
					label="SMS Target"
					onChange={handleTargetChange}
					placeholder="SMS..."
					value={target}
					Icon={Sms}
				/>
				<IconTextField
					label="Phonetic Target"
					onChange={handlePhoneticChange}
					value={phonetic}
					Icon={Phone}
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
