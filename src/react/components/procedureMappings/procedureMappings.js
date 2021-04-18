import React, { useEffect, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import ProcedureMappingsTable from './procedureMappingsTable';
import persistentStorage from '../../utilities/persistentStorage';
import AlertSnackbar from '../alertSnackbar';
import ProcedureMappingModal from './procedureMappingModal';

import { ReadOnlyConfigurationTitle, ReadOnlyConfigurationMessage } from '../../localization/en/snackbarText';

const useStyles = makeStyles(theme => ({
	buttonContainer: {
		marginTop: theme.spacing(2),
		display: 'flex',
		justifyContent: 'flex-end'
	},
	procedureMappingsContainer: {
		height: '100%',
		display: 'flex',
		flexFlow: 'column'
	}
}));

export default function ProcedureMappings() {
	const classes = useStyles();
	const [procedures, setProcedures] = useState(null);
	const [hasWritePermission, setHasWritePermission] = useState(null);
	const [editingProcedure, setEditingProcedure] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [messageTemplates, setMessageTempaltes] = useState(null);

	useEffect(() => {
		persistentStorage.getProcedureMappings().then(setProcedures);
		persistentStorage.getSettings(true).then(settings => setHasWritePermission(settings.shareData.behavior !== 1));
		persistentStorage.getMessageTemplates().then(setMessageTempaltes);
	}, []);

	const handleAddClick = () => setIsModalOpen(true);

	const handleCancel = () => {
		setEditingProcedure(null);
		setIsModalOpen(false);
	};

	const handleEdit = procedureMapping => {
		setEditingProcedure(procedureMapping);
		setIsModalOpen(true);
	};

	const handleRemove = procedureMapping => {
		persistentStorage.removeProcedureMappingWithSource(procedureMapping.source).then(setProcedures);
	};

	const handleSave = (procedureMapping, previousProcedureMapping) => {
		if (previousProcedureMapping) persistentStorage.removeProcedureMappingWithSource(previousProcedureMapping.source);
		persistentStorage.addProcedureMapping(procedureMapping).then(setProcedures);
		setIsModalOpen(false);
		setEditingProcedure(null);
	};

	return (
		<div className={classes.procedureMappingsContainer}>
			<ProcedureMappingsTable
				hasWritePermission={hasWritePermission}
				onEdit={handleEdit}
				onRemove={handleRemove}
				onSave={handleSave}
				procedures={procedures}
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
			<ProcedureMappingModal
				onCancel={handleCancel}
				onSave={handleSave}
				open={isModalOpen}
				messageTemplates={messageTemplates}
				procedure={editingProcedure}
				procedures={procedures}
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
