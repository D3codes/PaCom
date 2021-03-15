import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ContainedLabeledList from '../../../react/components/containedLabeledList';

const testItems = [
	{ name: '1', value: 'one' },
	{ name: '2', value: 'two' }
];

describe('ContainedLabeledList', () => {
	it('renders without crashing', () => {
		const { container } = render(<ContainedLabeledList onClick={jest.fn()} />);

		expect(container.firstChild.className.includes('containedLabeledListContainer')).toBe(true);
	});

	it('renders the list label and items without crashing', () => {
		const { getByText } = render(<ContainedLabeledList onClick={jest.fn()} label="Test Label" items={testItems} />);

		expect(getByText('Test Label'));
		expect(getByText('1'));
		expect(getByText('2'));
	});

	it('calls the onClick function when an item is clicked', () => {
		const onClickMock = jest.fn();
		const { getByText } = render(<ContainedLabeledList onClick={onClickMock} items={testItems} />);

		expect(getByText('1'));
		fireEvent.click(getByText('1'));

		expect(onClickMock).toBeCalled();
	});

	it('renders placeholder text when no items passed', () => {
		const { getByText } = render(<ContainedLabeledList onClick={jest.fn()} label="Test Labels" items={[]} />);

		expect(getByText('Test Labels'));
		expect(getByText('No Test Labels Found'));
	});
});
