import React, { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Provider from '../../models/provider';
import ProviderMappingsTable from './providerMappingsTable';
import persistentStorage from '../../utilities/persistentStorage';
import AlertSnackbar from '../alertSnackbar';
import ProviderMappingModal from './providerMappingModal';

import { UpdateDynamicValuesReminderMessage } from '../../localization/en/snackbarText';

const useStyles = makeStyles(theme => ({
	buttonContainer: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	providerMappingsContainer: {
		height: '100%'
	},
	content: {
		height: `calc(100% - ${theme.spacing(3)}px)`,
		display: 'flex',
		flexDirection: 'column',
		paddingBottom: theme.spacing(2)
	}
}));

export default function ProviderMappings({ providers, hasWritePermission = false, reload }) {
	const classes = useStyles();
	const [editingProvider, setEditingProvider] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

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
		persistentStorage.removeProviderMappingWithSource(providerMapping.source);
		reload();
	};

	const handleSave = (providerMapping, previousProviderMapping) => {
		if (previousProviderMapping) persistentStorage.removeProviderMappingWithSource(previousProviderMapping.source);
		else {
			setSnackbarMessage(UpdateDynamicValuesReminderMessage);
			setShowSnackbar(true);
		}
		persistentStorage.addProviderMapping(providerMapping);
		setIsModalOpen(false);
		setEditingProvider(null);
		reload();
	};

	return (
		<div className={classes.providerMappingsContainer}>
			<div className={classes.content}>
				<ProviderMappingsTable
					hasWritePermission={hasWritePermission}
					onEdit={handleEdit}
					onRemove={handleRemove}
					onSave={handleSave}
					providers={providers}
				/>
			</div>
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
			<AlertSnackbar
				severity={AlertSnackbar.Severities.Info}
				message={snackbarMessage}
				open={showSnackbar}
				onClose={() => { setShowSnackbar(false); }}
				autoHideDuration={5000}
			/>
		</div>
	);
}

ProviderMappings.propTypes = {
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider)).isRequired,
	hasWritePermission: PropTypes.bool,
	reload: PropTypes.func.isRequired
};
