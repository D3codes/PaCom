/* eslint-disable max-len */
import '@testing-library/jest-dom/extend-expect';
import KCPGInsight from '../../../react/transformers/KCPGInsight';
import { NullValueException } from '../../../react/errors/exceptions';

const testData = [
	'[null,"Visit Profile","Scheduler For","Provider","Visit Date", "Start Time", "Visit Status", "Encounter Status", "Superbill Status", "Claim Status", "Patient Name", "Last Name", "Fist Name", "Patient Group", "MRN", "e-RIN", "Phone", "Mobile", "Patient Category","Blocked Reason","Visit Type"]',
	'[null,"Psychiatric","Lambert, Garrett, MD","Lambert, Garrett, MD", "2022-04-04T00:00:00.000Z", "09:00 AM", "Pending", "Not Started", "Not Started", "Not Generated", "Freeman, David (M)", "Freeman", "David", null, "0000", null, null, "913-705-0325", null, null, "IH"]',
	'[null,"TMS","TMS","Brown, M David, MD", "2022-04-04T00:00:00.000Z", "09:45 AM", "Pending", "Not Started", "Not Started", "Not Generated", "Sasnett, Caullen (M)", "Sasnett", "Caullen", null, "0000", null, null, "913-683-8736", null, null, "IH"]',
];

const expectedTransform = '[{"patient":{"accountNumber":"","name":"Freeman, David","contactMethods":[{"phoneNumber":"913-705-0325","type":"Cell"}],'
						+ '"preferredContactMethod":"Cell","dateOfBirth":""},"appointment":{"date":"Mon, 04 Apr 2022","time":"09:00 AM","provider":'
						+ '{"source":"Lambert, Garrett, MD","sendToReminder":true,"sendToCustom":true},"duration":"","procedure":'
						+ '{"source":"IH","sendToReminder":true,"sendToCustom":true}},"status":"Pending","statusMessage":""},{"patient":'
						+ '{"accountNumber":"","name":"Sasnett, Caullen","contactMethods":[{"phoneNumber":"913-683-8736","type":"Cell"}],'
						+ '"preferredContactMethod":"Cell","dateOfBirth":""},"appointment":{"date":"Mon, 04 Apr 2022","time":"09:45 AM","provider":'
						+ '{"source":"TMS","sendToReminder":true,"sendToCustom":true},"duration":"","procedure":{"source":"IH","sendToReminder":true,"sendToCustom":true}},'
						+ '"status":"Pending","statusMessage":""}]';

describe('KCPGInsight', () => {
	it('correctly transforms data', () => {
		expect(JSON.stringify(KCPGInsight.transform(testData))).toEqual(expectedTransform);
	});

	it('returns an empty array if there are no rows or only one row', () => {
		expect(KCPGInsight.transform([])).toEqual([]);
		expect(KCPGInsight.transform([['1', '2', '3', '4', '5']])).toEqual([]);
	});

	it('throws an InvalidInputError if called with falsy data', () => {
		expect(() => { KCPGInsight.transform(undefined); }).toThrow(NullValueException);
		expect(() => { KCPGInsight.transform(null); }).toThrow(NullValueException);
		expect(() => { KCPGInsight.transform(''); }).toThrow(NullValueException);
	});
});
