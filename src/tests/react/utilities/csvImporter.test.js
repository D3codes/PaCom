import '@testing-library/jest-dom/extend-expect';
import csvImporter from '../../../react/utilities/csvImporter';

global.window.ipcRenderer = { send() {} };

describe('csvImporter', () => {
	it('correctly parses data', () => {
		expect(csvImporter.parse('1,2,3,4,5').data).toEqual([['1', '2', '3', '4', '5']]);
	});
});
