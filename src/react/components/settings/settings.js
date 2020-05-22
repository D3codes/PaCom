import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import AppointmentReminderSettings from './appointmentReminderSettings';
import CustomMessageSettings from './customMessageSettings';
import MessageReportSettings from './messageReportSettings';
import TwilioSettings from './twilioSettings';
import SharedDataSettings from './sharedDataSettings';
import persistantStorage from '../../utilities/persistantStorage';

export default function Settings({ selectedTabId, tabIds }) {
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
			{selectedTabId === tabIds.APPOINTMENT_REMINDERS_SETTINGS && <AppointmentReminderSettings appointmentReminders={appointmentReminderSettings} />}
			{selectedTabId === tabIds.CUSTOM_MESSAGE_SETTINGS && <CustomMessageSettings customMessage={customMessageSettings} />}
			{selectedTabId === tabIds.MESSAGE_REPORT_SETTINGS && <MessageReportSettings messageReports={messageReportSettings} />}
			{selectedTabId === tabIds.TWILIO_SETTINGS && <TwilioSettings twilio={twilioSettings} reloadSettings={reloadSettings} />}
			{selectedTabId === tabIds.SHARED_DATA_SETTINGS && <SharedDataSettings sharedData={sharedDataSettings} />}
		</Fragment>
	);
}

Settings.propTypes = {
	selectedTabId: PropTypes.string,
	tabIds: PropTypes.arrayOf(PropTypes.string)
};
