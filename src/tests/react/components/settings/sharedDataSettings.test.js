import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import SharedDataSettings from '../../../../react/components/settings/sharedDataSettings';

describe('SharedDataSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<SharedDataSettings />);
		expect(getByText('This is the Shared Data Settings Content')).toBeDefined();
	});
});
