import React, { useEffect, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import MessageTemplatesTable from './messageTemplatesTable';
import persistentStorage from '../../utilities/persistentStorage';
import AlertSnackbar from '../alertSnackbar';
import MessageTemplateModal from './messageTemplateModal';

import { ReadOnlyConfigurationTitle, ReadOnlyConfigurationMessage } from '../../localization/en/snackbarText';

const useStyles = makeStyles(theme => ({
	buttonContainer: {
		marginTop: theme.spacing(2),
		display: 'flex',
		justifyContent: 'flex-end'
	},
	messageTemplatesContainer: {
		height: '100%',
		display: 'flex',
		flexFlow: 'column'
	}
}));

export default function MessageTemplates() {
	const classes = useStyles();
	const [templates, setTemplates] = useState(null);
	const [hasWritePermission, setHasWritePermission] = useState(null);
	const [editingTemplate, setEditingTemplate] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		persistentStorage.getMessageTemplates().then(setTemplates);
		persistentStorage.getSettings(true).then(settings => setHasWritePermission(settings.shareData.behavior !== 1));
	}, []);

	const handleAddClick = () => setIsModalOpen(true);

	const handleCancel = () => {
		setEditingTemplate(null);
		setIsModalOpen(false);
	};

	const handleEdit = messageTemplate => {
		setEditingTemplate(messageTemplate);
		setIsModalOpen(true);
	};

	const handleRemove = messageTemplate => {
		persistentStorage.removeMessageTemplateWithName(messageTemplate.name).then(setTemplates);
	};

	const handleSave = (messageTemplate, previousMessageTemplate) => {
		if (previousMessageTemplate) persistentStorage.removeMessageTemplateWithName(previousMessageTemplate.name);
		persistentStorage.addMessageTemplate(messageTemplate).then(setTemplates);
		setIsModalOpen(false);
		setEditingTemplate(null);
	};

	return (
		<div className={classes.messageTemplatesContainer}>
			<MessageTemplatesTable
				hasWritePermission={hasWritePermission}
				onEdit={handleEdit}
				onRemove={handleRemove}
				onSave={handleSave}
				templates={templates}
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
			<MessageTemplateModal
				onCancel={handleCancel}
				onSave={handleSave}
				open={isModalOpen}
				template={editingTemplate}
				templates={templates}
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
