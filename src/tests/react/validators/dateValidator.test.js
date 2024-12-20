import '@testing-library/jest-dom/extend-expect';
import { add } from 'date-fns';

import valiDate from '../../../react/validators/dateValidator';

const localize = date => {
	const tzoffset = date.getTimezoneOffset() * 60000;
	return new Date(date - tzoffset);
};

const startOfTomorrow = () => {
	const now = localize(new Date());
	const year = now.getFullYear();
	const month = now.getMonth();
	const day = now.getDate();

	const date = new Date(0);
	date.setFullYear(year, month, day + 1);
	date.setHours(0, 0, 0, 0);
	return date;
};

describe('DateValidator', () => {
	it('returns true when appointment date is exactly the expected number of days away', () => {
		const preferences = {
			useBusinessDays: false,
			numberOfDays: 1,
			endOfRange: null
		};

		const isValid = valiDate.validate(startOfTomorrow().toDateString(), preferences);

		expect(isValid).toBeTruthy();
	});

	it('returns false when appointment date is NOT exactly the expected number of days away', () => {
		const preferences = {
			useBusinessDays: false,
			numberOfDays: 2,
			endOfRange: null
		};

		const isValid = valiDate.validate(startOfTomorrow().toDateString(), preferences);

		expect(isValid).toBeFalsy();
	});

	it('returns true when appointment date is exactly the expected number of business days away', () => {
		const preferences = {
			useBusinessDays: true,
			numberOfDays: 5,
			endOfRange: null
		};

		const isValid = valiDate.validate(localize(add(new Date(), { days: 7 })), preferences);

		expect(isValid).toBeTruthy();
	});

	it('returns false when appointment date is NOT exactly the expected number of business days away', () => {
		const preferences = {
			useBusinessDays: true,
			numberOfDays: 4,
			endOfRange: null
		};

		const isValid = valiDate.validate(localize(add(new Date(), { days: 7 })), preferences);

		expect(isValid).toBeFalsy();
	});

	it('returns true when appointment date is between the expected range of days away', () => {
		const preferences = {
			useBusinessDays: false,
			numberOfDays: 1,
			endOfRange: 3
		};

		const isValid = valiDate.validate(localize(add(new Date(), { days: 2 })), preferences);

		expect(isValid).toBeTruthy();
	});

	it('returns false when appointment date is before the expected range of days away', () => {
		const preferences = {
			useBusinessDays: false,
			numberOfDays: 7,
			endOfRange: 9
		};

		const isValid = valiDate.validate(localize(new Date()), preferences);

		expect(isValid).toBeFalsy();
	});

	it('returns false when appointment date is after the expected range of days away', () => {
		const preferences = {
			useBusinessDays: false,
			numberOfDays: 1,
			endOfRange: 3
		};

		const isValid = valiDate.validate(localize(add(new Date(), { days: 7 })), preferences);

		expect(isValid).toBeFalsy();
	});

	it('returns true when appointment date is between the expected range of business days away', () => {
		const preferences = {
			useBusinessDays: true,
			numberOfDays: 3,
			endOfRange: 5
		};

		const isValid = valiDate.validate(localize(add(new Date(), { days: 7 })), preferences);

		expect(isValid).toBeTruthy();
	});

	it('returns false when appointment date is before the expected range of business days away', () => {
		const preferences = {
			useBusinessDays: true,
			numberOfDays: 6,
			endOfRange: 8
		};

		const isValid = valiDate.validate(localize(add(new Date(), { days: 7 })), preferences);

		expect(isValid).toBeFalsy();
	});

	it('returns false when appointment date is after the expected range of business days away', () => {
		const preferences = {
			useBusinessDays: true,
			numberOfDays: 3,
			endOfRange: 4
		};

		const isValid = valiDate.validate(localize(add(new Date(), { days: 8 })), preferences);

		expect(isValid).toBeFalsy();
	});
});
