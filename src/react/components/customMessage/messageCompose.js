import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, TextField } from '@material-ui/core';
import ContainedLabeledList from '../containedLabeledList';
import persistentStorage from '../../utilities/persistentStorage';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		height: '100%'
	},
	listContainer: {
		width: 'calc(50% - 10px)',
		height: '90%'
	},
	textField: {
		width: '50%',
		height: '100%',
		marginRight: '10px',
		marginTop: '32px'
	}
});

function MessageCompose({
	messageIsValid, setMessage, message, disableDynamicValues = false, helperText = ''
}) {
	const classes = useStyles();

	const [dynamicValues, setDynamicValues] = useState(null);

	const reloadValues = () => {
		persistentStorage.getDynamicValues().then(values => {
			setDynamicValues(values);
		});
	};

	useEffect(() => {
		reloadValues();
	}, []);

	return (
		<div className={classes.root}>
			<TextField
				error={!messageIsValid}
				helperText={helperText}
				label="Message"
				multiline
				rows={15}
				variant="outlined"
				className={classes.textField}
				value={message}
				onChange={event => { setMessage(event.target.value); }}
				data-testId="message-field"
			/>
			<div className={classes.listContainer}>
				<ContainedLabeledList
					onClick={value => setMessage(prevMessage => `${prevMessage}{{${value.name}}}`)}
					label="Dynamic Values"
					items={dynamicValues}
					disabled={disableDynamicValues}
				/>
			</div>
		</div>
	);
}

MessageCompose.propTypes = {
	messageIsValid: PropTypes.bool.isRequired,
	setMessage: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired,
	disableDynamicValues: PropTypes.bool,
	helperText: PropTypes.string
};

export default MessageCompose;
