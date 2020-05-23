import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import AppointmentReminderSettings from './appointmentReminderSettings';
import CustomMessageSettings from './customMessageSettings';
import MessageReportSettings from './messageReportSettings';
import TwilioSettings from './twilioSettings';
import SharedDataSettings from './sharedDataSettings';
import persistantStorage from '../../utilities/persistantStorage';
import MiniDrawer from '../miniDrawer';

export default function Settings({ selectedTabId }) {
	const [appointmentReminderSettings, setAppointmentReminderSettings] = useState(null);
	const [customMessageSettings, setCustomMessageSettings] = useState(null);
	const [messageReportSettings, setMessageReportSettings] = useState(null);
	const [twilioSettings, setTwilioSettings] = useState(null);
	const [sharedDataSettings, setSharedDataSettings] = useState(null);

	const reloadSettings = () => {
		persistantStorage.getSettings().then(settings => {
			setAppointmentReminderSettings(settings.appointmentReminders);
			setCustomMessageSettings(settings.customMessages);
			setMessageReportSettings(settings.messageReports);
			setTwilioSettings(settings.twilio);
			setSharedDataSettings(settings.shareData);
		});
	};

	useEffect(() => {
		reloadSettings();
	}, []);

	return (
		<Fragment>
			{selectedTabId === MiniDrawer.TabIds.APPOINTMENT_REMINDERS_SETTINGS && <AppointmentReminderSettings appointmentReminders={appointmentReminderSettings} />}
			{selectedTabId === MiniDrawer.TabIds.CUSTOM_MESSAGE_SETTINGS && <CustomMessageSettings customMessage={customMessageSettings} />}
			{selectedTabId === MiniDrawer.TabIds.MESSAGE_REPORT_SETTINGS && <MessageReportSettings messageReports={messageReportSettings} />}
			{selectedTabId === MiniDrawer.TabIds.TWILIO_SETTINGS && <TwilioSettings twilio={twilioSettings} reloadSettings={reloadSettings} />}
			{selectedTabId === MiniDrawer.TabIds.SHARED_DATA_SETTINGS && <SharedDataSettings sharedData={sharedDataSettings} />}
		</Fragment>
	);
}

Settings.propTypes = {
	selectedTabId: PropTypes.oneOf(Object.values(MiniDrawer.TabIds)).isRequired
};
