import React, {
	useState, useEffect, useMemo, Fragment
} from 'react';
import PropTypes from 'prop-types';
import AppointmentReminderSettings from './appointmentReminderSettings';
import CustomMessageSettings from './customMessageSettings';
import MessageReportSettings from './messageReportSettings';
import TwilioSettings from './twilioSettings';
import SharedConfigurationSettings from './sharedConfigurationSettings';
import persistentStorage from '../../utilities/persistentStorage';
import MiniDrawer from '../miniDrawer';

export default function Settings({ selectedTabId }) {
	const [appointmentReminderSettings, setAppointmentReminderSettings] = useState(null);
	const [customMessageSettings, setCustomMessageSettings] = useState(null);
	const [messageReportSettings, setMessageReportSettings] = useState(null);
	const [twilioSettings, setTwilioSettings] = useState(null);
	const [sharedConfigurationSettings, setSharedConfigurationSettings] = useState(null);
	const hasWritePermission = useMemo(() => (sharedConfigurationSettings && sharedConfigurationSettings.behavior !== 1), [sharedConfigurationSettings]);

	const reloadSettings = () => {
		persistentStorage.getSettings().then(settings => {
			setAppointmentReminderSettings(settings.appointmentReminders);
			setCustomMessageSettings(settings.customMessages);
			setMessageReportSettings(settings.messageReports);
			setTwilioSettings(settings.twilio);
		});
		persistentStorage.getSettings(true).then(settings => { setSharedConfigurationSettings(settings.shareData); });
	};

	useEffect(() => {
		reloadSettings();
	}, []);

	return (
		<Fragment>
			{selectedTabId === MiniDrawer.TabIds.APPOINTMENT_REMINDERS_SETTINGS && (
				<AppointmentReminderSettings
					appointmentReminders={appointmentReminderSettings}
					hasWritePermission={hasWritePermission}
					reloadSettings={reloadSettings}
				/>
			)}
			{selectedTabId === MiniDrawer.TabIds.CUSTOM_MESSAGE_SETTINGS && (
				<CustomMessageSettings
					customMessage={customMessageSettings}
					hasWritePermission={hasWritePermission}
					reloadSettings={reloadSettings}
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
		</Fragment>
	);
}

Settings.propTypes = {
	selectedTabId: PropTypes.oneOf(Object.values(MiniDrawer.TabIds)).isRequired
};
