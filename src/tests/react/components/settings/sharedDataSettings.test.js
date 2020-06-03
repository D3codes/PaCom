import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import SharedConfigurationSettings from '../../../../react/components/settings/sharedConfigurationSettings';

describe('SharedConfigurationSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<SharedConfigurationSettings />);
		expect(getByText('This is the Shared Configuration Settings Content')).toBeDefined();
	});
});
