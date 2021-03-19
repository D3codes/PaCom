import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, TextField
} from '@material-ui/core';
import { Save } from '@material-ui/icons';

import Template from '../../models/template';
import messageController from '../../utilities/messageController';
import MessageCompose from '../customMessage/messageCompose';

import {
	MessageTemplateNameInUseTitle, MessageTemplateNameInUseMessage
} from '../../localization/en/dialogText';

const useStyles = makeStyles(theme => ({
	dialogContent: {
		'& > * + *': {
			marginTop: theme.spacing(2)
		}
	}
}));

function MessageTemplateModal({
	onCancel, onSave, open = false, template = null, templates = null
}) {
	const classes = useStyles();

	const [name, setName] = useState('');
	const [body, setBody] = useState('');

	useEffect(() => {
		if (open && template) {
			setName(template.name);
			setBody(template.body);
		}
	}, [open, template]);

	const applyInitialState = () => {
		setName('');
		setBody('');
	};

	const handleNameChange = event => setName(event.target.value);

	const handleBodyChange = value => setBody(value);

	const handleBodyAppend = value => setBody(prev => `${prev}${value}`);

	const handleCancel = () => {
		onCancel();
		applyInitialState();
	};

	const handleSave = () => {
		const existingTemplate = !template && templates?.find(temp => temp.name === name);
		if (existingTemplate) {
			messageController.confirmSave(MessageTemplateNameInUseTitle, MessageTemplateNameInUseMessage).then(({ response }) => {
				if (response === 0) {
					const newMessageTemplate = new Template(name, body);
					onSave(newMessageTemplate, template);
					applyInitialState();
				}
			});
		} else {
			const newMessageTemplate = new Template(name, body);
			onSave(newMessageTemplate, template);
			applyInitialState();
		}
	};

	const isSaveDisabled = !(name && body);

	return (
		<Dialog fullWidth open={open} maxWidth="md">
			<DialogTitle>{template ? 'Edit' : 'Add'} Message Template</DialogTitle>
			<DialogContent className={classes.dialogContent}>
				<TextField
					autoFocus
					fullWidth
					label="Name"
					onChange={handleNameChange}
					placeholder="Template Name..."
					value={name}
				/>
				<MessageCompose
					messageIsValid
					onMessageChange={handleBodyChange}
					onAppend={handleBodyAppend}
					message={body}
					modal
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color="primary">Cancel</Button>
				<Button
					disabled={isSaveDisabled}
					endIcon={<Save />}
					onClick={handleSave}
					color="primary"
					variant={isSaveDisabled ? 'outlined' : 'contained'}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

MessageTemplateModal.propTypes = {
	onCancel: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	open: PropTypes.bool,
	template: PropTypes.instanceOf(Template),
	templates: PropTypes.arrayOf(PropTypes.instanceOf(Template))
};

export default MessageTemplateModal;
