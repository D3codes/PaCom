import React, { useEffect, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import ProviderMappingsTable from './providerMappingsTable';
import persistentStorage from '../../utilities/persistentStorage';
import AlertSnackbar from '../alertSnackbar';
import ProviderMappingModal from './providerMappingModal';

import {
	UpdateDyanmicValuesReminderTitle, UpdateDynamicValuesReminderMessage
} from '../../localization/en/alertDialog';
import messageController from '../../utilities/messageController';

const useStyles = makeStyles(theme => ({
	buttonContainer: {
		marginTop: theme.spacing(2),
		display: 'flex',
		justifyContent: 'flex-end'
	},
	providerMappingsContainer: {
		height: '100%',
		display: 'flex',
		flexFlow: 'column'
	}
}));

export default function ProviderMappings() {
	const classes = useStyles();
	const [providers, setProviders] = useState(null);
	const [hasWritePermission, setHasWritePermission] = useState(null);
	const [editingProvider, setEditingProvider] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		persistentStorage.getProviderMappings().then(setProviders);
		persistentStorage.getSettings(true).then(settings => setHasWritePermission(settings.shareData.behavior !== 1));
	}, []);

	const handleAddClick = () => setIsModalOpen(true);

	const handleCancel = () => {
		setEditingProvider(null);
		setIsModalOpen(false);
	};

	const handleEdit = providerMapping => {
		setEditingProvider(providerMapping);
		setIsModalOpen(true);
	};

	const handleRemove = providerMapping => {
		persistentStorage.removeProviderMappingWithSource(providerMapping.source).then(setProviders);
	};

	const handleSave = (providerMapping, previousProviderMapping) => {
		if (previousProviderMapping) persistentStorage.removeProviderMappingWithSource(previousProviderMapping.source);
		else messageController.showInfo(UpdateDyanmicValuesReminderTitle, UpdateDynamicValuesReminderMessage);
		persistentStorage.addProviderMapping(providerMapping).then(setProviders);
		setIsModalOpen(false);
		setEditingProvider(null);
	};

	return (
		<div className={classes.providerMappingsContainer}>
			<ProviderMappingsTable
				hasWritePermission={hasWritePermission}
				onEdit={handleEdit}
				onRemove={handleRemove}
				onSave={handleSave}
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
			<ProviderMappingModal
				onCancel={handleCancel}
				onSave={handleSave}
				open={isModalOpen}
				provider={editingProvider}
				providers={providers}
			/>
			{hasWritePermission !== null && (
				<AlertSnackbar
					open={!hasWritePermission}
					severity={AlertSnackbar.Severities.Info}
					title="Configuration set to Network - Read Only"
					message="Settings cannot be changed"
				/>
			)}
		</div>
	);
}
