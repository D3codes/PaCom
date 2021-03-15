import React, { useEffect, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import ProviderMappingsTable from './providerMappingsTable';
import persistentStorage from '../../utilities/persistentStorage';
import AlertSnackbar from '../alertSnackbar';
import ProviderMappingModal from './providerMappingModal';

const useStyles = makeStyles({
	buttonContainer: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	noProviderMappingsContainer: {
		display: 'flex',
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	},
	providerMappingsContainer: {
		height: '100%',
		display: 'flex',
		flexFlow: 'column'
	}
});

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

	const handleEdit = providerMapping => {
		setEditingProvider(providerMapping);
	};

	const handleRemove = providerMapping => {
		persistentStorage.removeProviderMappingWithSource(providerMapping.source).then(setProviders);
	};

	const handleSave = providerMapping => {
		persistentStorage.addProviderMapping(providerMapping).then(setProviders);
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
				<Button color="primary" endIcon={<Add />} onClick={handleAddClick} variant="contained">Add</Button>
			</div>
			<ProviderMappingModal
				open={isModalOpen}
				provider={editingProvider}
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
