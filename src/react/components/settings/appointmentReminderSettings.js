import React, { useState, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Warning, Block, Save, EventBusy, ExpandMore, Today
} from '@material-ui/icons';
import {
	Typography, Divider, Select, FormControl, MenuItem, TextField, Button, Accordion, AccordionSummary, AccordionDetails
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import persistentStorage from '../../utilities/persistentStorage';
import ContactPreferences from './contactPreferences';
import DescriptiveIconButton from '../descriptiveIconButton';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	adornmentDivider: {
		margin: theme.spacing()
	},
	actionButtonContainer: {
		display: 'flex',
		alignSelf: 'flex-end'
	},
	divider: {
		marginTop: theme.spacing(),
		marginBottom: theme.spacing()
	},
	dateVerificationOptions: {
		marginTop: theme.spacing(),
		marginBottom: theme.spacing()
	},
	dayInputField: {
		width: 30
	}
}));

export default function AppointmentRemindersSettings({ appointmentReminders, reloadSettings, hasWritePermission }) {
	const classes = useStyles();
	const [numberOfDays, setNumberOfDays] = useState(appointmentReminders.dateVerification.numberOfDays);
	const [endOfRange, setEndOfRange] = useState(appointmentReminders.dateVerification.endOfRange);
	const [allowSendOutsideRange, setAllowSendOutsideRange] = useState(appointmentReminders.dateVerification.allowSendOutsideRange);
	const [shouldUseBusinessDays, setShouldUseBusinessDays] = useState(appointmentReminders.dateVerification.useBusinessDays);
	const [sendToPreferredAndSms, setSendToPreferredAndSms] = useState(appointmentReminders.contactPreferences.sendToPreferredAndSms);
	const [textHomeIfCellNotAvailable, setTextHomeIfCellNotAvailable] = useState(appointmentReminders.contactPreferences.textHomeIfCellNotAvailable);

	const changesToSave = useMemo(() => (
		allowSendOutsideRange !== appointmentReminders.dateVerification.allowSendOutsideRange
		|| numberOfDays !== appointmentReminders.dateVerification.numberOfDays
		|| endOfRange !== appointmentReminders.dateVerification.endOfRange
		|| shouldUseBusinessDays !== appointmentReminders.dateVerification.useBusinessDays
		|| sendToPreferredAndSms !== appointmentReminders.contactPreferences.sendToPreferredAndSms
		|| textHomeIfCellNotAvailable !== appointmentReminders.contactPreferences.textHomeIfCellNotAvailable
	), [allowSendOutsideRange, numberOfDays, endOfRange, shouldUseBusinessDays, sendToPreferredAndSms, textHomeIfCellNotAvailable, appointmentReminders]);

	const handleSave = () => {
		if (allowSendOutsideRange !== appointmentReminders.dateVerification.allowSendOutsideRange) persistentStorage.setAllowSendOutsideRange(allowSendOutsideRange);
		if (numberOfDays !== appointmentReminders.dateVerification.numberOfDays) persistentStorage.setNumberOfDays(numberOfDays);
		if (endOfRange !== appointmentReminders.dateVerification.endOfRange) persistentStorage.setEndOfRange(endOfRange);
		if (shouldUseBusinessDays !== appointmentReminders.dateVerification.useBusinessDays) persistentStorage.setUseBusinessDays(shouldUseBusinessDays);
		if (sendToPreferredAndSms !== appointmentReminders.contactPreferences.sendToPreferredAndSms) persistentStorage.setSendToPreferredAndSmsForReminders(sendToPreferredAndSms);
		if (textHomeIfCellNotAvailable !== appointmentReminders.contactPreferences.textHomeIfCellNotAvailable) {
			persistentStorage.setTextHomeIfCellNotAvailableForReminders(textHomeIfCellNotAvailable);
		}
		reloadSettings();
	};

	return (
		<div className={classes.root}>
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMore />}
					id="dateVerification-header">
					<Today color="primary" style={{ fontSize: '3rem', textAlign: 'left' }} />
					<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
					<Typography color="primary" variant="h4">Date Verification</Typography>
				</AccordionSummary>
				<AccordionDetails className={classes.root}>
					<div className={classes.dateVerificationOptions}>
						<Typography variant="h5" display="inline">Reminders should be sent  </Typography>
						<FormControl>
							<Select
								value={!endOfRange}
								disabled={!hasWritePermission}
								onChange={event => { setEndOfRange(event.target.value ? null : numberOfDays + 1); }}
								inputProps={{ 'aria-label': 'Without label' }}>
								<MenuItem value>Exactly</MenuItem>
								<MenuItem value={false}>Between</MenuItem>
							</Select>
						</FormControl>
						<Typography variant="h5" display="inline">  </Typography>
						<TextField
							type="number"
							value={numberOfDays}
							disabled={!hasWritePermission}
							className={classes.dayInputField}
							onChange={event => { setNumberOfDays(parseInt(event.target.value, 10)); }}
							InputProps={{ inputProps: { min: 0 } }}
						/>
						{ endOfRange && (
							<Fragment>
								<Typography variant="h5" display="inline">  to  </Typography>
								<TextField
									type="number"
									value={endOfRange}
									disabled={!hasWritePermission}
									className={classes.dayInputField}
									onChange={event => { setEndOfRange(parseInt(event.target.value, 10)); }}
									InputProps={{ inputProps: { min: numberOfDays + 1 } }}
								/>
							</Fragment>
						)}
						<Typography variant="h5" display="inline">  </Typography>
						<FormControl>
							<Select
								value={shouldUseBusinessDays}
								disabled={!hasWritePermission}
								onChange={event => { setShouldUseBusinessDays(event.target.value); }}
								inputProps={{ 'aria-label': 'Without label' }}>
								<MenuItem value={false}>day(s)</MenuItem>
								<MenuItem value>business day(s)</MenuItem>
							</Select>
						</FormControl>
						<Typography variant="h5" display="inline">  before appointment.</Typography>
					</div>
					<div>
						<DescriptiveIconButton
							onClick={() => { setAllowSendOutsideRange(0); }}
							disabled={!hasWritePermission}
							selected={allowSendOutsideRange === 0}
							title="OFF"
							description="Do not verify the date before sending reminders."
							Icon={EventBusy}
						/>
						<DescriptiveIconButton
							onClick={() => { setAllowSendOutsideRange(1); }}
							disabled={!hasWritePermission}
							selected={allowSendOutsideRange === 1}
							title="WARNING"
							description="Show warning if reminders are sent outside of specified time."
							Icon={Warning}
						/>
						<DescriptiveIconButton
							onClick={() => { setAllowSendOutsideRange(2); }}
							disabled={!hasWritePermission}
							selected={allowSendOutsideRange === 2}
							title="BLOCK"
							description="Do not allow reminders to be sent outside of specified time."
							Icon={Block}
						/>
					</div>
				</AccordionDetails>
			</Accordion>
			<ContactPreferences
				sendToPreferredAndSms={sendToPreferredAndSms}
				setSendToPreferredAndSms={setSendToPreferredAndSms}
				textHomeIfCellNotAvailable={textHomeIfCellNotAvailable}
				setTextHomeIfCellNotAvailable={setTextHomeIfCellNotAvailable}
				hasWritePermission={hasWritePermission}
			/>
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

AppointmentRemindersSettings.propTypes = {
	appointmentReminders: PropTypes.shape(
		{
			dateVerification: PropTypes.shape({
				numberOfDays: PropTypes.number,
				endOfRange: PropTypes.number,
				allowSendOutsideRange: PropTypes.number,
				useBusinessDays: PropTypes.bool
			}),
			contactPreferences: PropTypes.shape({
				sendToPreferredAndSms: PropTypes.bool,
				textHomeIfCellNotAvailable: PropTypes.bool
			})
		}
	).isRequired,
	reloadSettings: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired
};
