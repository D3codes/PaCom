import { differenceInBusinessDays, differenceInDays } from 'date-fns';

export default function validate(dateString, preferences) {
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
