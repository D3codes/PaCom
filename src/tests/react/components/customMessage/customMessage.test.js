import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import CustomMessage from '../../../../react/components/customMessage/customMessage';

describe('CustomMessage', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<CustomMessage />);
		expect(getByText('Send To Specific Number')).toBeDefined();
	});
});
