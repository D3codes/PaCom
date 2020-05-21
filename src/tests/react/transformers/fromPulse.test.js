import '@testing-library/jest-dom/extend-expect';
import fromPulse from '../../../react/transformers/fromPulse';
import { NullValueException } from '../../../react/exceptions';

const testData = [
	['Kansas City Psychiatric Group', 'APPOINTMENTS FOR PROVIDER: GLAMB - Garrett D Lambert, MD on', 'Friday 8/9/2019', '', 'Time', 'Dur.', 'Patient', 'Patient Account', 'Policy'],
	['7:00 AM', '60', 'Freeman, David D', '12345-67', '09/11/1994', 'Cell', '', '(913)705-0325', '(913)705-0325'],
	['Kansas City Psychiatric Group', 'APPOINTMENTS FOR PROVIDER: JLOB - Jacqueline Lob, LCSW on', 'Friday 8/9/2019', '', 'Time', 'Dur.', 'Patient', 'Patient Account', 'Policy'],
	['7:00 AM', '60', 'Sasnett, Caullen R', '12345-89', '01/11/1995', 'Phone', '', '(913)683-8736', '(913)683-8736']
];

const expectedTransform = '[{"patient":{"accountNumber":"12345-67","name":"Freeman, David D","contactMethods":[{"phoneNumber":"(913)705-0325","type":"Home"},'
                        + '{"phoneNumber":"(913)705-0325","type":"Cell"}],"preferredContactMethod":"Cell","dateOfBirth":"09/11/1994"},'
                        + '"appointment":{"date":"APPOINTMENTS FOR PROVIDER: GLAMB - Garrett D Lambert, MD on","time":"7:00 AM",'
                        + '"provider":{"source":"Kansas City Psychiatric Group"},"duration":"60"},"status":"Pending"},{"patient":{"accountNumber":"12345-89",'
                        + '"name":"Sasnett, Caullen R","contactMethods":[{"phoneNumber":"(913)683-8736","type":"Home"},{"phoneNumber":"(913)683-8736","type":"Cell"}],'
                        + '"preferredContactMethod":"Phone","dateOfBirth":"01/11/1995"},"appointment":{"date":"APPOINTMENTS FOR PROVIDER: JLOB - Jacqueline Lob, LCSW on",'
                        + '"time":"7:00 AM","provider":{"source":"Kansas City Psychiatric Group"},"duration":"60"},"status":"Pending"}]';

describe('fromPulse', () => {
	it('correctly transforms data', () => {
		expect(JSON.stringify(fromPulse(testData))).toEqual(expectedTransform);
	});

	it('returns an empty array if there are no rows or only one row', () => {
		expect(fromPulse([])).toEqual([]);
		expect(fromPulse([['1', '2', '3', '4', '5']])).toEqual([]);
	});

	it('throws an InvalidInputError if called with falsy data', () => {
		expect(() => { fromPulse(undefined); }).toThrow(NullValueException);
		expect(() => { fromPulse(null); }).toThrow(NullValueException);
		expect(() => { fromPulse(''); }).toThrow(NullValueException);
	});
});
