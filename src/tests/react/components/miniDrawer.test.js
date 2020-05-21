import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import usePromiseMock from '../../../react/hooks/usePromise';
import MiniDrawer from '../../../react/components/miniDrawer';

jest.mock('../../../react/utilities/getVersion', () => '0.1.0');
jest.mock('../../../react/hooks/usePromise');

describe('MiniDrawer', () => {
	it('renders without crashing', () => {
		usePromiseMock.mockImplementation(() => []);

		const { getByText } = render(
			<MiniDrawer
				open={false}
				onChevronClick={jest.fn()}
				onTabSelect={jest.fn()}
				selectedTabId="sndApptRmdrs"
				settingsOpen={false}
			/>
		);

		expect(getByText('Send Appointment Reminders')).toBeDefined();
		expect(getByText('Send Custom Message')).toBeDefined();
		expect(getByText('Provider Mappings')).toBeDefined();
		expect(getByText('Message Templates')).toBeDefined();
		expect(getByText('Settings')).toBeDefined();
	});
});
