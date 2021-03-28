const byProviderAndDate = reminders => reminders.reduce((remindersByProviderAndDate, reminder) => {
	const providerDateKey = `${reminder.getIn(['appointment', 'provider', 'target'], 'Unmapped Provider(s)')} - ${reminder.getIn(['appointment', 'date'])}`;
	const updatedRemindersByProviderAndDate = { ...remindersByProviderAndDate };
	if (updatedRemindersByProviderAndDate[providerDateKey]) {
		updatedRemindersByProviderAndDate[providerDateKey].push(reminder);
	} else {
		updatedRemindersByProviderAndDate[providerDateKey] = [reminder];
	}
	return updatedRemindersByProviderAndDate;
}, {});

export default {
	byProviderAndDate
};
