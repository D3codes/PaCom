import '@testing-library/jest-dom/extend-expect';
import KCPG from '../../../react/transformers/KCPG';
import { NullValueException } from '../../../react/errors/exceptions';

const testData = [
	['Kansas City Psychiatric Group', 'APPOINTMENTS FOR PROVIDER: GLAMB - Garrett D Lambert, MD on', 'Friday 8/9/2019', '', 'Time', 'Dur.', 'Patient', 'Patient Account', 'Policy'],
	['7:00 AM', '60', 'Freeman, David D', '12345-67', '09/11/1994', 'Cell', '', '(913)705-0325', '(913)705-0325', 'OV'],
	['Kansas City Psychiatric Group', 'APPOINTMENTS FOR PROVIDER: JLOB - Jacqueline Lob, LCSW on', 'Friday 8/9/2019', '', 'Time', 'Dur.', 'Patient', 'Patient Account', 'Policy'],
	['7:00 AM', '60', 'Sasnett, Caullen R', '12345-89', '01/11/1995', 'Phone', '', '(913)683-8736', '(913)683-8736', 'TELEMED']
];

const expectedTransform = '[{"patient":{"accountNumber":"12345-67","name":"Freeman, David D","contactMethods":[{"phoneNumber":"(913)705-0325","type":"Home"},'
						+ '{"phoneNumber":"(913)705-0325","type":"Cell"}],"preferredContactMethod":"Cell","dateOfBirth":"09/11/1994"},"appointment":'
						+ '{"date":"Friday 8/9/2019","time":"7:00 AM","provider":{"source":"APPOINTMENTS FOR PROVIDER: GLAMB - Garrett D Lambert, MD on",'
						+ '"sendToReminder":true,"sendToCustom":true},'
						+ '"duration":"60","procedure":{"source":"OV","sendToReminder":true,"sendToCustom":true}},"status":"Pending","statusMessage":""},'
						+ '{"patient":{"accountNumber":"12345-89","name":'
						+ '"Sasnett, Caullen R","contactMethods":[{"phoneNumber":"(913)683-8736","type":"Home"},{"phoneNumber":"(913)683-8736","type":"Cell"}],'
						+ '"preferredContactMethod":"Phone","dateOfBirth":"01/11/1995"},"appointment":{"date":"Friday 8/9/2019","time":"7:00 AM","provider":'
						+ '{"source":"APPOINTMENTS FOR PROVIDER: JLOB - Jacqueline Lob, LCSW on","sendToReminder":true,"sendToCustom":true},"duration":"60",'
						+ '"procedure":{"source":"TELEMED","sendToReminder":true,"sendToCustom":true}},"status":"Pending",'
						+ '"statusMessage":""}]';

describe('KCPG', () => {
	it('correctly transforms data', () => {
		expect(JSON.stringify(KCPG.transform(testData))).toEqual(expectedTransform);
	});

	it('returns an empty array if there are no rows or only one row', () => {
		expect(KCPG.transform([])).toEqual([]);
		expect(KCPG.transform([['1', '2', '3', '4', '5']])).toEqual([]);
	});

	it('throws an InvalidInputError if called with falsy data', () => {
		expect(() => { KCPG.transform(undefined); }).toThrow(NullValueException);
		expect(() => { KCPG.transform(null); }).toThrow(NullValueException);
		expect(() => { KCPG.transform(''); }).toThrow(NullValueException);
	});
});
