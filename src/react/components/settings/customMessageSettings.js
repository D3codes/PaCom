import React, { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Save } from '@material-ui/icons';
import PropTypes from 'prop-types';
import persistentStorage from '../../utilities/persistentStorage';
import ContactPreferences from './contactPreferences';

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	actionButtonContainer: {
		display: 'flex',
		alignSelf: 'flex-end'
	},
	contactPreferencesContainer: {
		flex: 1
	}
}));

export default function CustomMessageSettings({ customMessages, reloadSettings, hasWritePermission }) {
	const classes = useStyles();
	const [sendToPreferredAndSms, setSendToPreferredAndSms] = useState(customMessages.contactPreferences.sendToPreferredAndSms);
	const [textHomeIfCellNotAvailable, setTextHomeIfCellNotAvailable] = useState(customMessages.contactPreferences.textHomeIfCellNotAvailable);

	const changesToSave = useMemo(() => (
		sendToPreferredAndSms !== customMessages.contactPreferences.sendToPreferredAndSms
		|| textHomeIfCellNotAvailable !== customMessages.contactPreferences.textHomeIfCellNotAvailable
	), [sendToPreferredAndSms, textHomeIfCellNotAvailable, customMessages]);

	const handleSave = () => {
		if (sendToPreferredAndSms !== customMessages.contactPreferences.sendToPreferredAndSms) {
			persistentStorage.setSendToPreferredAndSmsForCustomMessages(sendToPreferredAndSms);
		}
		if (textHomeIfCellNotAvailable !== customMessages.contactPreferences.textHomeIfCellNotAvailable) {
			persistentStorage.setTextHomeIfCellNotAvailableForCustomMessages(textHomeIfCellNotAvailable);
		}
		reloadSettings();
	};

	return (
		<div className={classes.root}>
			<div className={classes.contactPreferencesContainer}>
				<ContactPreferences
					sendToPreferredAndSms={sendToPreferredAndSms}
					setSendToPreferredAndSms={setSendToPreferredAndSms}
					textHomeIfCellNotAvailable={textHomeIfCellNotAvailable}
					setTextHomeIfCellNotAvailable={setTextHomeIfCellNotAvailable}
					hasWritePermission={hasWritePermission}
				/>
			</div>
			<div className={classes.actionButtonContainer}>
				<Button
					disabled={!hasWritePermission || !changesToSave}
					endIcon={<Save />}
					color="primary"
					variant={(hasWritePermission && changesToSave) ? 'contained' : 'outlined'}
					onClick={handleSave}>
						Save
				</Button>
			</div>
		</div>
	);
}

CustomMessageSettings.propTypes = {
	customMessages: PropTypes.shape(
		{
			contactPreferences: {
				sendToPreferredAndSms: PropTypes.bool,
				textHomeIfCellNotAvailable: PropTypes.bool
			}
		}
	).isRequired,
	reloadSettings: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired
};
