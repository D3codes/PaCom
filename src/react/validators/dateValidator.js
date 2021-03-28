import { differenceInBusinessDays, differenceInDays } from 'date-fns';
import AllowSendOutsideRange from '../models/allowSendOutsideRange';
import messageController from '../utilities/messageController';
import {
	DateVerificationWarningTitle, DateVerificationWarningMessage,
	DateVerificationBlockTitle, DateVerificationBlockMessage
} from '../localization/en/dialogText';

function validate(dateString, preferences) {
	const { useBusinessDays, numberOfDays, endOfRange } = preferences;
	const appointmentDate = new Date(dateString);
	const today = new Date();
	const tzoffset = today.getTimezoneOffset() * 60000;
	const localDate = new Date(today - tzoffset);
	localDate.setHours(0, 0, 0, 0);
	const difference = useBusinessDays ? differenceInBusinessDays : differenceInDays;
	const daysUntilAppointment = difference(appointmentDate, localDate);

	const doesMeetExactDateQualifications = !endOfRange && daysUntilAppointment === numberOfDays;
	const doesMeetDateRangeQualifications = daysUntilAppointment <= endOfRange && daysUntilAppointment >= numberOfDays;
	return doesMeetExactDateQualifications || doesMeetDateRangeQualifications;
}

async function validateAppointmentDates(reminders, dateVerificationSettings) {
	if (dateVerificationSettings.allowSendOutsideRange === AllowSendOutsideRange.NoValidation) return true;

	const isValid = reminders.some(reminder => validate(reminder.getIn(['appointment', 'date']), dateVerificationSettings));
	if (!isValid && dateVerificationSettings.allowSendOutsideRange === AllowSendOutsideRange.ShowWarning) {
		messageController.showWarning(DateVerificationWarningTitle, DateVerificationWarningMessage);
	} else if (!isValid && dateVerificationSettings.allowSendOutsideRange === AllowSendOutsideRange.Block) {
		messageController.showError(DateVerificationBlockTitle, DateVerificationBlockMessage);
	}

	return isValid;
}

export default {
	validate,
	validateAppointmentDates
};
