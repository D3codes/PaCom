import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import CustomMessageSettings from '../../../../react/components/settings/customMessageSettings';

describe('CustomMessageSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<CustomMessageSettings />);
		expect(getByText('This is the Custom Message Settings Content')).toBeDefined();
	});
});
