import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import Settings from '../../../../react/components/settings/settings';

describe('Settings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<Settings />);
		expect(getByText('This is the Settings Content')).toBeDefined();
	});
});
