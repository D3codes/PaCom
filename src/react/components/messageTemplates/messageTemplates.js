import React, { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Procedure from '../../models/procedure';
import Template from '../../models/template';
import MessageTemplatesTable from './messageTemplatesTable';
import persistentStorage from '../../utilities/persistentStorage';
import MessageTemplateModal from './messageTemplateModal';

const useStyles = makeStyles(theme => ({
	buttonContainer: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	messageTemplatesContainer: {
		height: '100%'
	},
	content: {
		height: `calc(100% - ${theme.spacing(3)}px)`,
		display: 'flex',
		flexDirection: 'column',
		paddingBottom: theme.spacing(2)
	}
}));

export default function MessageTemplates({
	templates, procedureMappings, defaultPhoneReminderTemplate = null, defaultSmsReminderTemplate = null, hasWritePermission = false, reload
}) {
	const classes = useStyles();
	const [editingTemplate, setEditingTemplate] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

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
		persistentStorage.removeMessageTemplateWithName(messageTemplate.name);
		reload();
	};

	const handleSave = (messageTemplate, previousMessageTemplate) => {
		if (previousMessageTemplate) persistentStorage.removeMessageTemplateWithName(previousMessageTemplate.name);
		persistentStorage.addMessageTemplate(messageTemplate);
		setIsModalOpen(false);
		setEditingTemplate(null);
		reload();
	};

	return (
		<div className={classes.messageTemplatesContainer}>
			<div className={classes.content}>
				<MessageTemplatesTable
					hasWritePermission={hasWritePermission}
					onEdit={handleEdit}
					onRemove={handleRemove}
					onSave={handleSave}
					templates={templates}
					defaultPhoneTemplate={defaultPhoneReminderTemplate}
					defaultSmsTemplate={defaultSmsReminderTemplate}
					procedureMappings={procedureMappings}
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
			<MessageTemplateModal
				onCancel={handleCancel}
				onSave={handleSave}
				open={isModalOpen}
				template={editingTemplate}
				templates={templates}
			/>
		</div>
	);
}

MessageTemplates.propTypes = {
	templates: PropTypes.arrayOf(PropTypes.instanceOf(Template)).isRequired,
	procedureMappings: PropTypes.arrayOf(PropTypes.instanceOf(Procedure)).isRequired,
	defaultPhoneReminderTemplate: PropTypes.string,
	defaultSmsReminderTemplate: PropTypes.string,
	hasWritePermission: PropTypes.bool,
	reload: PropTypes.func.isRequired
};
