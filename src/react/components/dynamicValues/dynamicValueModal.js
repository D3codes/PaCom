import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, TableContainer
} from '@material-ui/core';
import { Save, Label } from '@material-ui/icons';
import IconTextField from '../iconTextField';

import DynamicValueMappingsTable from './dynamicValueMappingsTable';
import Provider from '../../models/provider';
import DynamicValue from '../../models/dynamicValue';
import dialogController from '../../utilities/dialogController';
import MessageCompose from '../customMessage/messageCompose';

import {
	DynamicValueNameInUseTitle, DynamicValueNameInUseMessage,
	DynamicValueNameReservedTitle, DynamicValueNameReservedMessage
} from '../../localization/en/dialogText';

const useStyles = makeStyles(theme => ({
	dialogTitle: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.secondary.contrastText
	},
	dialogContent: {
		'& > * + *': {
			marginTop: theme.spacing(2)
		},
		display: 'flex',
		flexDirection: 'column',
		marginTop: theme.spacing(2)
	}
}));

function DynamicValueModal({
	onCancel, onSave, providers, open = false, dynamicValue = null, dynamicValues = null, defaultValues = null
}) {
	const classes = useStyles();

	const [name, setName] = useState('');
	const [fromApptList, setFromApptList] = useState(false);
	const [mappings, setMappings] = useState([]);
	const [editProvider, setEditProvider] = useState('');
	const [value, setValue] = useState('');

	useEffect(() => {
		if (open && dynamicValue) {
			setName(dynamicValue.name);
			setFromApptList(dynamicValue.fromApptList);
			setMappings(dynamicValue.mappings);
		}
	}, [open, dynamicValue]);

	const applyInitialState = () => {
		setName('');
		setFromApptList(false);
		setMappings([]);
		setEditProvider('');
		setValue('');
	};

	const handleNameChange = nameValue => setName(nameValue);

	const handleValueChange = body => setValue(body);

	const handleValueAppend = body => setValue(prev => `${prev}${body}`);

	const handleMappingsChange = () => {
		const updated = [...mappings];
		const index = updated.findIndex(map => map.providerSource === editProvider);
		if (index === -1) {
			updated.push(
				{
					providerSource: editProvider,
					value
				}
			);
		} else {
			updated[index].value = value;
		}
		setMappings(updated);
		setEditProvider('');
		setValue('');
	};

	const editMapping = (providerSource, val) => {
		setEditProvider(providerSource);
		setValue(val);
	};

	const handleSave = () => {
		const existingValue = !dynamicValue && dynamicValues?.find(val => val.name === name);
		const existingDefaultValue = defaultValues?.find(val => val.name === name);
		if (existingDefaultValue) {
			dialogController.showError(DynamicValueNameReservedTitle, `${name}${DynamicValueNameReservedMessage}`);
		} else if (existingValue) {
			dialogController.confirmSave(DynamicValueNameInUseTitle, DynamicValueNameInUseMessage).then(({ response }) => {
				if (response === 0) {
					const newDynamicValue = new DynamicValue(name, fromApptList, mappings);
					onSave(newDynamicValue, dynamicValue);
					applyInitialState();
				}
			});
		} else {
			const newDynamicValue = new DynamicValue(name, fromApptList, mappings);
			onSave(newDynamicValue, dynamicValue);
			applyInitialState();
		}
	};

	const saveDisabled = !name || dynamicValue?.mappings === mappings;

	return (
		<Dialog fullWidth open={open} maxWidth="md" onExited={applyInitialState}>
			{!editProvider && <DialogTitle className={classes.dialogTitle}>{dynamicValue ? 'Edit' : 'Add'} Dynamic Value</DialogTitle>}
			{editProvider && (
				<DialogTitle className={classes.dialogTitle}>
					Value for {providers?.find(provider => provider.source === editProvider).target || editProvider}
				</DialogTitle>
			)}
			<DialogContent className={classes.dialogContent}>
				{!editProvider && (
					<Fragment>
						<IconTextField
							autoFocus
							label="Dynamic Value Name"
							onChange={handleNameChange}
							value={name}
							Icon={Label}
						/>
						<TableContainer>
							<DynamicValueMappingsTable
								onEdit={editMapping}
								mappings={mappings}
								providers={providers}
							/>
						</TableContainer>
					</Fragment>
				)}
				{editProvider && (
					<MessageCompose
						messageIsValid
						onMessageChange={handleValueChange}
						onAppend={handleValueAppend}
						message={value}
						modal
						defaultDynamicValues
					/>
				)}
			</DialogContent>
			{!editProvider && (
				<DialogActions>
					<Button onClick={onCancel} color="primary">Cancel</Button>
					<Button
						disabled={saveDisabled}
						endIcon={<Save />}
						onClick={handleSave}
						color="primary"
						variant={saveDisabled ? 'outlined' : 'contained'}>
						Save
					</Button>
				</DialogActions>
			)}
			{editProvider && (
				<DialogActions>
					<Button onClick={handleMappingsChange} variant="contained" color="primary">Done</Button>
				</DialogActions>
			)}
		</Dialog>
	);
}

DynamicValueModal.propTypes = {
	onCancel: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider)),
	open: PropTypes.bool,
	dynamicValue: PropTypes.instanceOf(DynamicValue),
	dynamicValues: PropTypes.arrayOf(PropTypes.instanceOf(DynamicValue)),
	defaultValues: PropTypes.arrayOf(PropTypes.instanceOf(DynamicValue))
};

export default DynamicValueModal;
