import React, { useState, useEffect, useMemo } from 'react';
import {
	AppBar, CssBaseline, makeStyles, Toolbar, Typography
} from '@material-ui/core';

import AppointmentReminders from './components/appointmentReminders/appointmentReminders';
import CustomMessage from './components/customMessage/customMessage';
import MessageTemplates from './components/messageTemplates/messageTemplates';
import MiniDrawer, { DRAWER_WIDTH } from './components/drawer/miniDrawer';
import ProviderMappings from './components/providerMappings/providerMappings';
import ProcedureMappings from './components/procedureMappings/procedureMappings';
import DynamicValues from './components/dynamicValues/dynamicValues';
import AppointmentReminderSettings from './components/settings/appointmentReminderSettings';
import CustomMessageSettings from './components/settings/customMessageSettings';
import TwilioSettings from './components/settings/twilioSettings';
import MessageReportSettings from './components/settings/messageReportSettings';
import SharedConfigurationSettings from './components/settings/sharedConfigurationSettings';
import sendingStatus from './utilities/sendingStatus';
import ErrorBoundary from './components/errors/errorBoundary';
import persistentStorage from './utilities/persistentStorage';
import AlertSnackbar from './components/alertSnackbar';
import envInfo from './utilities/envInfo';

import {
	ReadOnlyConfigurationTitle, ReadOnlyConfigurationMessage, EndOfSupportTitle, EndOfSupportMessage
} from './localization/en/snackbarText';

const useStyles = makeStyles(theme => ({
	content: {
		display: 'flex',
		height: '100%',
		overflow: 'hidden'
	},
	appBar: {
		marginLeft: DRAWER_WIDTH,
		width: `calc(100% - ${DRAWER_WIDTH}px)`
	},
	container: {
		height: '100%'
	},
	main: {
		flexGrow: 1,
		padding: theme.spacing(3),
		height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`
	},
	toolbar: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	toolbarSpacer: {
		minHeight: theme.mixins.toolbar.minHeight
	}
}));

function getTitle(tabId) {
	const foundTab = MiniDrawer.Tabs.find(tab => tab.id === tabId);
	return foundTab ? foundTab.title : '';
}

export default function App() {
	const classes = useStyles();
	const [selectedTabId, setSelectedTabId] = useState(MiniDrawer.Tabs[0].id);
	const [disableNavigation, setDisableNavigation] = useState(false);
	useEffect(() => { sendingStatus.update(disableNavigation); }, [disableNavigation]);

	// REVERT
	const [showEndOfSupportSnackbar, setShowEndOfSupportSnackbar] = useState(true);

	const title = getTitle(selectedTabId);

	const [appointmentReminderSettings, setAppointmentReminderSettings] = useState(null);
	const [customMessageSettings, setCustomMessageSettings] = useState(null);
	const [messageReportSettings, setMessageReportSettings] = useState(null);
	const [twilioSettings, setTwilioSettings] = useState(null);
	const [sharedConfigurationSettings, setSharedConfigurationSettings] = useState(null);
	const hasWritePermission = useMemo(() => (sharedConfigurationSettings && sharedConfigurationSettings.behavior !== 1), [sharedConfigurationSettings]);
	const [providerMappings, setProviderMappings] = useState([]);
	const [procedureMappings, setProcedureMappings] = useState([]);
	const [messageTemplates, setMessageTemplates] = useState([]);
	const [dynamicValues, setDynamicValues] = useState([]);
	const [isDev, setIsDev] = useState(false);

	const reloadSettings = () => {
		persistentStorage.getSettings().then(settings => {
			setAppointmentReminderSettings(settings.appointmentReminders);
			setCustomMessageSettings(settings.customMessages);
			setMessageReportSettings(settings.messageReports);
			setTwilioSettings(settings.twilio);
		});
		persistentStorage.getSettings(true).then(settings => { setSharedConfigurationSettings(settings.shareData); });
		persistentStorage.getProviderMappings().then(setProviderMappings);
		persistentStorage.getProcedureMappings().then(setProcedureMappings);
		persistentStorage.getMessageTemplates().then(setMessageTemplates);
		persistentStorage.getDynamicValues().then(setDynamicValues);
	};

	useEffect(() => {
		envInfo.getIsDev().then(setIsDev);
		reloadSettings();
	}, []);

	return (
		<ErrorBoundary>
			<div className={classes.content}>
				<CssBaseline />
				<MiniDrawer onTabSelect={setSelectedTabId} disableNavigation={disableNavigation} selectedTabId={selectedTabId} />
				<AppBar
					position="fixed"
					className={classes.appBar}>
					<Toolbar className={classes.toolbar}>
						<Typography variant="h6" noWrap>
							{title}
						</Typography>
						{isDev && (
							<Typography align="right" color="error" noWrap>
								DEV MODE
							</Typography>
						)}
						{
							// REVERT
							<Typography align="right" color="error" noWrap>
								OUT OF SUPPORT
							</Typography>
						}
					</Toolbar>
				</AppBar>
				<main className={classes.main}>
					<div className={classes.toolbarSpacer} />
					{selectedTabId === MiniDrawer.TabIds.SEND_APPOINTMENT_REMINDERS && (
						<AppointmentReminders
							providerMappings={providerMappings}
							procedureMappings={procedureMappings}
							appointmentReminderSettings={appointmentReminderSettings}
							messageTemplates={messageTemplates}
							hasWritePermission={hasWritePermission}
							disableNavigation={disableNavigation}
							onDisableNavigationChange={setDisableNavigation}
							reload={reloadSettings}
						/>
					)}
					{selectedTabId === MiniDrawer.TabIds.SEND_CUSTOM_MESSAGE && (
						<CustomMessage
							messageTemplates={messageTemplates}
							customMessageSettings={customMessageSettings}
							hasWritePermission={hasWritePermission}
							providerMappings={providerMappings}
							procedureMappings={procedureMappings}
							disableNavigation={disableNavigation}
							onDisableNavigationChange={setDisableNavigation}
							reload={reloadSettings}
						/>
					)}
					{selectedTabId === MiniDrawer.TabIds.PROVIDER_MAPPINGS && (
						<ProviderMappings
							providers={providerMappings}
							hasWritePermission={hasWritePermission}
							reload={reloadSettings}
						/>
					)}
					{selectedTabId === MiniDrawer.TabIds.PROCEDURE_MAPPINGS && (
						<ProcedureMappings
							procedures={procedureMappings}
							messageTemplates={messageTemplates}
							hasWritePermission={hasWritePermission}
							reload={reloadSettings}
						/>
					)}
					{selectedTabId === MiniDrawer.TabIds.MESSAGE_TEMPLATES && (
						<MessageTemplates
							templates={messageTemplates}
							procedureMappings={procedureMappings}
							defaultPhoneReminderTemplate={appointmentReminderSettings?.defaultReminderTemplates?.phone}
							defaultSmsReminderTemplate={appointmentReminderSettings?.defaultReminderTemplates?.sms}
							hasWritePermission={hasWritePermission}
							reload={reloadSettings}
						/>
					)}
					{selectedTabId === MiniDrawer.TabIds.DYNAMIC_VALUES && (
						<DynamicValues
							dynamicValues={dynamicValues}
							providers={providerMappings}
							hasWritePermission={hasWritePermission}
							reload={reloadSettings}
						/>
					)}
					{selectedTabId === MiniDrawer.TabIds.APPOINTMENT_REMINDERS_SETTINGS && (
						<AppointmentReminderSettings
							appointmentReminders={appointmentReminderSettings}
							providers={providerMappings}
							procedures={procedureMappings}
							messageTemplates={messageTemplates}
							hasWritePermission={hasWritePermission}
							reloadSettings={reloadSettings}
						/>
					)}
					{selectedTabId === MiniDrawer.TabIds.CUSTOM_MESSAGE_SETTINGS && (
						<CustomMessageSettings
							customMessages={customMessageSettings}
							hasWritePermission={hasWritePermission}
							reloadSettings={reloadSettings}
							providers={providerMappings}
							procedures={procedureMappings}
						/>
					)}
					{selectedTabId === MiniDrawer.TabIds.MESSAGE_REPORT_SETTINGS && (
						<MessageReportSettings
							messageReports={messageReportSettings}
							hasWritePermission={hasWritePermission}
							reloadSettings={reloadSettings}
						/>
					)}
					{selectedTabId === MiniDrawer.TabIds.TWILIO_SETTINGS && (
						<TwilioSettings
							twilio={twilioSettings}
							reloadSettings={reloadSettings}
							hasWritePermission={hasWritePermission}
						/>
					)}
					{selectedTabId === MiniDrawer.TabIds.SHARED_CONFIGURATION_SETTINGS && (
						<SharedConfigurationSettings
							sharedConfig={sharedConfigurationSettings}
							reloadSettings={reloadSettings}
						/>
					)}
					<AlertSnackbar
						open={!hasWritePermission
							&& selectedTabId !== MiniDrawer.TabIds.SEND_APPOINTMENT_REMINDERS
							&& selectedTabId !== MiniDrawer.TabIds.SEND_CUSTOM_MESSAGE
							&& selectedTabId !== MiniDrawer.TabIds.SHARED_CONFIGURATION_SETTINGS}
						severity={AlertSnackbar.Severities.Info}
						title={ReadOnlyConfigurationTitle}
						message={ReadOnlyConfigurationMessage}
					/>
					{
						// REVERT
						<AlertSnackbar
							open={showEndOfSupportSnackbar}
							severity={AlertSnackbar.Severities.Error}
							title={EndOfSupportTitle}
							message={EndOfSupportMessage}
							onClose={() => { setShowEndOfSupportSnackbar(false); }}
						/>
					}
				</main>
			</div>
		</ErrorBoundary>
	);
}
