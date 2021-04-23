import React, { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Provider from '../../models/provider';
import DynamicValue from '../../models/dynamicValue';
import DynamicValuesTable from './dynamicValuesTable';
import persistentStorage from '../../utilities/persistentStorage';
import DynamicValueModal from './dynamicValueModal';

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

export default function DynamicValues({
	dynamicValues, providers, hasWritePermission, reload
}) {
	const classes = useStyles();
	const [editingValue, setEditingValue] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

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
		persistentStorage.removeDynamicValueWithName(dynamicValue.name, false);
		reload();
	};

	const handleSave = (dynamicValue, previousDynamicValue) => {
		if (previousDynamicValue) persistentStorage.removeDynamicValueWithName(previousDynamicValue.name, false);
		persistentStorage.addDynamicValue(dynamicValue, false);
		setIsModalOpen(false);
		setEditingValue(null);
		reload();
	};

	return (
		<div className={classes.dynamicValuesContainer}>
			<DynamicValuesTable
				hasWritePermission={hasWritePermission}
				onEdit={handleEdit}
				onRemove={handleRemove}
				onSave={handleSave}
				dynamicValues={dynamicValues?.filter(val => !val.fromApptList) || []}
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
				dynamicValues={dynamicValues?.filter(val => !val.fromApptList) || []}
				defaultValues={dynamicValues?.filter(val => val.fromApptList) || []}
			/>
		</div>
	);
}

DynamicValues.propTypes = {
	dynamicValues: PropTypes.arrayOf(PropTypes.instanceOf(DynamicValue)).isRequired,
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider)).isRequired,
	hasWritePermission: PropTypes.bool.isRequired,
	reload: PropTypes.func.isRequired
};
