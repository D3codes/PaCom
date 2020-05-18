import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import usePromiseMock from '../../react/hooks/usePromise';
import App from '../../react/app';

jest.mock('../../react/utilities/getVersion', () => '0.1.0');
jest.mock('../../react/hooks/usePromise');

it('renders without crashing', () => {
	usePromiseMock.mockImplementation(() => []);

	const { getAllByText } = render(<App />);
	expect(getAllByText('Send Appointment Reminders'));
});
