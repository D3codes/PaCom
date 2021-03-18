import React, { useEffect, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import DynamicValuesTable from './dynamicValuesTable';
import persistentStorage from '../../utilities/persistentStorage';
import AlertSnackbar from '../alertSnackbar';
import DynamicValueModal from './dynamicValueModal';

import { ReadOnlyConfigurationTitle, ReadOnlyConfigurationMessage } from '../../localization/en/snackbarText';

const useStyles = makeStyles(theme => ({
	buttonContainer: {
		marginTop: theme.spacing(2),
		display: 'flex',
		justifyContent: 'flex-end'
	},
	dynamicValuesContainer: {
		height: '100%',
		display: 'flex',
		flexFlow: 'column'
	}
}));

export default function DynamicValues() {
	const classes = useStyles();
	const [dynamicValues, setDynamicValues] = useState(null);
	const [providers, setProviders] = useState(null);
	const [hasWritePermission, setHasWritePermission] = useState(null);
	const [editingValue, setEditingValue] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [defaultValues, setDefaultValues] = useState([]);

	useEffect(() => {
		persistentStorage.getDynamicValues(false).then(setDynamicValues);
		persistentStorage.getSettings(true).then(settings => setHasWritePermission(settings.shareData.behavior !== 1));
		persistentStorage.getProviderMappings().then(setProviders);
		persistentStorage.getDynamicValues().then(values => {
			setDefaultValues(values.filter(val => val.fromApptList));
		});
	}, []);

	const handleAddClick = () => setIsModalOpen(true);

	const handleCancel = () => {
		setEditingValue(null);
		setIsModalOpen(false);
	};

	const handleEdit = dynamicValue => {
		setEditingValue(dynamicValue);
		setIsModalOpen(true);
	};

	const handleRemove = dynamicValue => {
		persistentStorage.removeDynamicValueWithName(dynamicValue.name, false).then(setDynamicValues);
	};

	const handleSave = (dynamicValue, previousDynamicValue) => {
		if (previousDynamicValue) persistentStorage.removeDynamicValueWithName(previousDynamicValue.name, false);
		persistentStorage.addDynamicValue(dynamicValue, false).then(setDynamicValues);
		setIsModalOpen(false);
		setEditingValue(null);
	};

	return (
		<div className={classes.dynamicValuesContainer}>
			<DynamicValuesTable
				hasWritePermission={hasWritePermission}
				onEdit={handleEdit}
				onRemove={handleRemove}
				onSave={handleSave}
				dynamicValues={dynamicValues}
				providers={providers}
			/>
			<div className={classes.buttonContainer}>
				<Button
					color="primary"
					endIcon={<Add />}
					onClick={handleAddClick}
					disabled={!hasWritePermission}
					variant={hasWritePermission ? 'contained' : 'outlined'}>
					Add
				</Button>
			</div>
			<DynamicValueModal
				onCancel={handleCancel}
				onSave={handleSave}
				providers={providers}
				open={isModalOpen}
				dynamicValue={editingValue}
				dynamicValues={dynamicValues}
				defaultValues={defaultValues}
			/>
			{hasWritePermission !== null && (
				<AlertSnackbar
					open={!hasWritePermission}
					severity={AlertSnackbar.Severities.Info}
					title={ReadOnlyConfigurationTitle}
					message={ReadOnlyConfigurationMessage}
				/>
			)}
		</div>
	);
}
