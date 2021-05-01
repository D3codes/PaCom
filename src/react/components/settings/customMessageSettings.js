import React, { useMemo, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography, Button, Tabs, Tab
} from '@material-ui/core';
import { Save } from '@material-ui/icons';
import PropTypes from 'prop-types';
import persistentStorage from '../../utilities/persistentStorage';
import ContactPreferences from './contactPreferences';
import DateVerification from './dateVerification';
import { DRAWER_WIDTH } from '../drawer/miniDrawer';
import SendTo from '../common/sendTo';
import Provider from '../../models/provider';
import Procedure from '../../models/procedure';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
		marginTop: `${theme.mixins.toolbar.minHeight}px`
	},
	actionButtonContainer: {
		alignSelf: 'flex-end'
	},
	tabContent: {
		height: '100%'
	},
	tabContainer: {
		height: `calc(100% - ${theme.spacing(3)}px)`
	},
	descriptionText: {
		marginBottom: theme.spacing(3)
	},
	navContainer: {
		backgroundColor: theme.palette.primary.main,
		position: 'absolute',
		top: `${theme.mixins.toolbar.minHeight}px`,
		left: `${DRAWER_WIDTH}px`,
		width: `calc(100% - ${DRAWER_WIDTH}px)`,
		zIndex: 1101,
		boxShadow: '0px 4px 5px 0px rgba(0,0,0,0.14)',
		color: 'white'
	},
	sendToContainer: {
		height: '90%'
	}
}));

const TABS = {
	DEFAULT_SEND_TO: 0,
	DATE_VERIFICATION: 1,
	CONTACT_PREFERENCES: 2
};

export default function CustomMessageSettings({
	customMessages, reloadSettings, providers, procedures, hasWritePermission
}) {
	const classes = useStyles();
	const [sendToPreferredAndSms, setSendToPreferredAndSms] = useState(customMessages.contactPreferences.sendToPreferredAndSms);
	const [textHomeIfCellNotAvailable, setTextHomeIfCellNotAvailable] = useState(customMessages.contactPreferences.textHomeIfCellNotAvailable);
	const [dateVerification, setDateVerification] = useState(customMessages.dateVerification);
	const [providerMappings, setProviderMappings] = useState(providers);
	const [procedureMappings, setProcedureMappings] = useState(procedures);
	const [openTab, setOpenTab] = useState(0);

	const handleTabChange = (event, newValue) => {
		setOpenTab(newValue);
	};

	const mappingsMatch = (mapping1, mapping2) => {
		if (mapping1.length !== mapping2.length) return false;

		for (let i = 0; i < mapping1.length; i += 1) {
			if (!mapping2.some(x => (x.source === mapping1[i].source) && (x.sendToCustom === mapping1[i].sendToCustom))) return false;
		}

		return true;
	};

	const changesToSave = useMemo(() => (
		sendToPreferredAndSms !== customMessages.contactPreferences.sendToPreferredAndSms
		|| textHomeIfCellNotAvailable !== customMessages.contactPreferences.textHomeIfCellNotAvailable
		|| dateVerification.allowSendOutsideRange !== customMessages.dateVerification.allowSendOutsideRange
		|| dateVerification.numberOfDays !== customMessages.dateVerification.numberOfDays
		|| dateVerification.endOfRange !== customMessages.dateVerification.endOfRange
		|| dateVerification.useBusinessDays !== customMessages.dateVerification.useBusinessDays
		|| !mappingsMatch(providerMappings, providers)
		|| !mappingsMatch(procedureMappings, procedures)
	), [sendToPreferredAndSms, textHomeIfCellNotAvailable, customMessages, dateVerification, providerMappings, procedureMappings, providers, procedures]);

	const handleSave = () => {
		if (sendToPreferredAndSms !== customMessages.contactPreferences.sendToPreferredAndSms) {
			persistentStorage.setSendToPreferredAndSmsForCustomMessages(sendToPreferredAndSms);
		}
		if (textHomeIfCellNotAvailable !== customMessages.contactPreferences.textHomeIfCellNotAvailable) {
			persistentStorage.setTextHomeIfCellNotAvailableForCustomMessages(textHomeIfCellNotAvailable);
		}
		if (dateVerification.allowSendOutsideRange !== customMessages.dateVerification.allowSendOutsideRange) {
			persistentStorage.setAllowSendOutsideRangeForCustomMessages(dateVerification.allowSendOutsideRange);
		}
		if (dateVerification.numberOfDays !== customMessages.dateVerification.numberOfDays) persistentStorage.setNumberOfDaysForCustomMessages(dateVerification.numberOfDays);
		if (dateVerification.endOfRange !== customMessages.dateVerification.endOfRange) persistentStorage.setEndOfRangeForCustomMessage(dateVerification.endOfRange);
		if (dateVerification.useBusinessDays !== customMessages.dateVerification.useBusinessDays) {
			persistentStorage.setUseBusinessDaysForCustomMessages(dateVerification.useBusinessDays);
		}
		if (!mappingsMatch(providerMappings, providers)) {
			providerMappings.forEach(provider => { persistentStorage.addProviderMapping(provider); });
		}
		if (!mappingsMatch(procedureMappings, procedures)) {
			procedureMappings.forEach(procedure => { persistentStorage.addProcedureMapping(procedure); });
		}
		reloadSettings();
	};

	return (
		<div className={classes.root}>
			<div className={classes.tabContainer}>
				<div className={classes.navContainer}>
					<Tabs
						value={openTab}
						onChange={handleTabChange}>
						<Tab label="Default Recipients" />
						<Tab label="Date Verification" />
						<Tab label="Contact Preferences" />
					</Tabs>
				</div>
				<div className={classes.tabContent}>
					{openTab === TABS.DEFAULT_SEND_TO && (
						<Fragment>
							<Typography className={classes.descriptionText}>
							Select which Providers and Procedures should receive custom messages by default.
							</Typography>
							<div className={classes.sendToContainer}>
								<SendTo
									providerMappings={providerMappings}
									procedureMappings={procedureMappings}
									onProvidersChange={setProviderMappings}
									onProceduresChange={setProcedureMappings}
									hasWritePermission={hasWritePermission}
								/>
							</div>
						</Fragment>
					)}
					{openTab === TABS.DATE_VERIFICATION && (
						<DateVerification
							dateVerification={dateVerification}
							onChange={setDateVerification}
							hasWritePermission={hasWritePermission}
						/>
					)}
					{openTab === TABS.CONTACT_PREFERENCES && (
						<ContactPreferences
							sendToPreferredAndSms={sendToPreferredAndSms}
							setSendToPreferredAndSms={setSendToPreferredAndSms}
							textHomeIfCellNotAvailable={textHomeIfCellNotAvailable}
							setTextHomeIfCellNotAvailable={setTextHomeIfCellNotAvailable}
							hasWritePermission={hasWritePermission}
						/>
					)}
				</div>
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
	providers: PropTypes.arrayOf(PropTypes.instanceOf(Provider)).isRequired,
	procedures: PropTypes.arrayOf(PropTypes.instanceOf(Procedure)).isRequired,
	reloadSettings: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired
};
