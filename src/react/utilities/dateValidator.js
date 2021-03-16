import { differenceInBusinessDays, differenceInDays } from 'date-fns';

export default function validate(dateString, preferences) {
	const { useBusinessDays, numberOfDays, endOfRange } = preferences;
	const appointmentDate = new Date(dateString);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const difference = useBusinessDays ? differenceInBusinessDays : differenceInDays;
	const daysUntilAppointment = difference(appointmentDate, today);

	const doesMeetExactDateQualifications = !endOfRange && daysUntilAppointment === numberOfDays;
	const doesMeetDateRangeQualifications = daysUntilAppointment <= endOfRange && daysUntilAppointment >= numberOfDays;
	return doesMeetExactDateQualifications || doesMeetDateRangeQualifications;
}
