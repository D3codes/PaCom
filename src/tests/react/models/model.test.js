/* eslint-disable max-classes-per-file */
import '@testing-library/jest-dom/extend-expect';
import Model from '../../../react/models/model';

class Foo extends Model {
	constructor(valueOne, valueTwo) {
		super();
		this.valueOne = valueOne;
		this.valueTwo = valueTwo;
	}
}

class Bar extends Model {
	constructor(valueThree, valueFour) {
		super();
		this.valueThree = valueThree;
		this.valueFour = valueFour;
	}
}

describe('model', () => {
	const bar = new Bar(3, 4);
	const foo = new Foo(1, bar);

	it('returns expected value from get', () => {
		expect(foo.get('valueOne')).toEqual(1);
	});

	it('returns expectedValue from getIn', () => {
		expect(foo.getIn(['valueTwo', 'valueThree'])).toEqual(3);
	});

	it('returns null when invalid key is passed to get', () => {
		expect(foo.get('valueFive')).toEqual(null);
	});

	it('returns null when invalid key is passed to getIn', () => {
		expect(foo.getIn(['valueTwo', 'valueSix'])).toEqual(null);
	});

	it('returns notSetValue when invalid key is passed to get', () => {
		expect(foo.get('valueFive', 5)).toEqual(5);
	});

	it('returns notSetValue when invalid key path is passed to getIn', () => {
		expect(foo.getIn(['valueTwo', 'valueSix'], 6)).toEqual(6);
	});
});
