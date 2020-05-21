import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import TwilioSettings from '../../../../react/components/settings/twilioSettings';

describe('TwilioSettings', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<TwilioSettings />);
		expect(getByText('This is the Twilio Settings Content')).toBeDefined();
	});
});
