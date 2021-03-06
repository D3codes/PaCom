import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import ContainedLabeledList from '../../../react/components/containedLabeledList';

describe('ContainedLabeledList', () => {
	it('renders without crashing', () => {
		const { container } = render(<ContainedLabeledList onClick={jest.fn()} />);
		expect(container.firstChild.className.includes('containedLabeledListContainer')).toBe(true);
	});
});
