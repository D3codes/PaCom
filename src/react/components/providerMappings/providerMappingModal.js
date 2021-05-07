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
	const [sendToReminder, setSendToReminder] = useState(true);
	const [sendToCustom, setSendToCustom] = useState(true);

	useEffect(() => {
		if (open && provider) {
			setSource(provider.source);
			setTarget(provider.target);
			setPhonetic(provider.phonetic);
			setSendToReminder(provider.sendToReminder);
			setSendToCustom(provider.sendToCustom);
		}
	}, [open, provider]);

	const applyInitialState = () => {
		setSource('');
		setTarget('');
		setPhonetic('');
	};

	const handleSourceChange = value => setSource(value);

	const handleTargetChange = value => setTarget(value);

	const handlePhoneticChange = value => setPhonetic(value);

	const handleCancel = () => {
		onCancel();
		applyInitialState();
	};

	const handleSave = () => {
		const otherProviders = (provider ? providers?.filter(x => x.source !== provider.source) : providers) ?? [];
		const providersThatContainSource = otherProviders.filter(x => x.source.includes(source)).map(x => x.source);
		const providersContainedInSource = otherProviders.filter(x => source.includes(x.source)).map(x => x.source);

		if (providersThatContainSource.length > 0 || providersContainedInSource.length > 0) {
			dialogController.showError(
				ProviderMappingSourceInUseTitle,
				ProviderMappingSourceInUseMessage + providersThatContainSource.join('\n') + providersContainedInSource.join('\n')
			);
		} else {
			const newProviderMapping = new Provider(source, target, phonetic, sendToReminder, sendToCustom);
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
					testId="source-field"
				/>
				<IconTextField
					label="SMS Target"
					onChange={handleTargetChange}
					placeholder="SMS..."
					value={target}
					Icon={Sms}
					testId="sms-target-field"
				/>
				<IconTextField
					label="Phonetic Target"
					onChange={handlePhoneticChange}
					value={phonetic}
					Icon={Phone}
					testId="phonetic-target-field"
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
