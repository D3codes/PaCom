import React, { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Procedure from '../../models/procedure';
import Template from '../../models/template';
import ProcedureMappingsTable from './procedureMappingsTable';
import persistentStorage from '../../utilities/persistentStorage';
import ProcedureMappingModal from './procedureMappingModal';

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

export default function ProcedureMappings({
	procedures, messageTemplates, hasWritePermission = false, reload
}) {
	const classes = useStyles();
	const [editingProcedure, setEditingProcedure] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

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
		persistentStorage.removeProcedureMappingWithSource(procedureMapping.source);
		reload();
	};

	const handleSave = (procedureMapping, previousProcedureMapping) => {
		if (previousProcedureMapping) persistentStorage.removeProcedureMappingWithSource(previousProcedureMapping.source);
		persistentStorage.addProcedureMapping(procedureMapping);
		setIsModalOpen(false);
		setEditingProcedure(null);
		reload();
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
		</div>
	);
}

ProcedureMappings.propTypes = {
	procedures: PropTypes.arrayOf(PropTypes.instanceOf(Procedure)).isRequired,
	messageTemplates: PropTypes.arrayOf(PropTypes.instanceOf(Template)).isRequired,
	hasWritePermission: PropTypes.bool,
	reload: PropTypes.func.isRequired
};
