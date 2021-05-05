import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles
} from '@material-ui/core';
import { Save, Label } from '@material-ui/icons';
import IconTextField from '../iconTextField';

import Template from '../../models/template';
import dialogController from '../../utilities/dialogController';
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

	const handleNameChange = value => setName(value);

	const handleBodyChange = value => setBody(value);

	const handleBodyAppend = value => setBody(prev => `${prev}${value}`);

	const handleCancel = () => {
		onCancel();
		applyInitialState();
	};

	const handleSave = () => {
		const existingTemplate = !template && templates?.find(temp => temp.name === name);
		if (existingTemplate) {
			dialogController.confirmSave(MessageTemplateNameInUseTitle, MessageTemplateNameInUseMessage).then(({ response }) => {
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

	const isSaveDisabled = !(name && body) || name.toLocaleLowerCase() === 'default';

	return (
		<Dialog fullWidth open={open} maxWidth="md">
			<DialogTitle>{template ? 'Edit' : 'Add'} Message Template</DialogTitle>
			<DialogContent className={classes.dialogContent}>
				<IconTextField
					autoFocus
					label="Template Name"
					onChange={handleNameChange}
					value={name}
					Icon={Label}
					error={name.toLocaleLowerCase() === 'default'}
					helperText={name.toLocaleLowerCase() === 'default' ? 'Cannot Use Reserved Template Name' : ''}
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
