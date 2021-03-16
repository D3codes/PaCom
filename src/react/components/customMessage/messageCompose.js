import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, TextField } from '@material-ui/core';
import clsx from 'clsx';
import ContainedLabeledList from '../containedLabeledList';
import persistentStorage from '../../utilities/persistentStorage';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		height: '100%'
	},
	listContainer: {
		width: `calc(50% - ${theme.spacing()}px)`,
		height: '90%'
	},
	textField: {
		width: '50%',
		height: '100%',
		marginRight: theme.spacing()
	},
	textFieldMargin: {
		marginTop: theme.spacing(4)
	},
	containerHeight: {
		height: '320px'
	}
}));

function MessageCompose({
	messageIsValid, onMessageChange, onAppend, message, disableDynamicValues = false, helperText = '', modal = false, defaultDynamicValues = false
}) {
	const classes = useStyles();

	const [dynamicValues, setDynamicValues] = useState(null);

	const reloadValues = () => {
		persistentStorage.getDynamicValues().then(values => {
			setDynamicValues(defaultDynamicValues ? values.filter(val => val.fromApptList) : values);
		});
	};

	useEffect(() => {
		reloadValues();
	}, []);

	return (
		<div className={clsx(classes.root, { [classes.containerHeight]: modal })}>
			<TextField
				error={!messageIsValid}
				helperText={helperText}
				label="Message"
				multiline
				rows={15}
				variant="outlined"
				className={clsx(classes.textField, { [classes.textFieldMargin]: !modal })}
				value={message}
				onChange={event => { onMessageChange(event.target.value); }}
				data-testid="message-field"
			/>
			<div className={classes.listContainer}>
				<ContainedLabeledList
					onClick={value => onAppend(`{{${value.name}}}`)}
					label={defaultDynamicValues ? 'Report Dynamic Values' : 'Dynamic Values'}
					items={dynamicValues}
					disabled={disableDynamicValues && dynamicValues}
				/>
			</div>
		</div>
	);
}

MessageCompose.propTypes = {
	messageIsValid: PropTypes.bool.isRequired,
	onMessageChange: PropTypes.func.isRequired,
	onAppend: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired,
	disableDynamicValues: PropTypes.bool,
	helperText: PropTypes.string,
	modal: PropTypes.bool,
	defaultDynamicValues: PropTypes.bool
};

export default MessageCompose;
