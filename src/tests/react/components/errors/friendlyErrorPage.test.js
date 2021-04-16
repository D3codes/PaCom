import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import FriendlyErrorPage from '../../../../react/components/errors/friendlyErrorPage';

describe('FriendlyErrorPage', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<FriendlyErrorPage />);

		expect(getByText('An Error has occurred')).toBeDefined();
	});

	it('displays error code', () => {
		const testErrorCode = 'test-error-code';
		const { getByText } = render(<FriendlyErrorPage errorCode={testErrorCode} />);

		expect(getByText(testErrorCode)).toBeDefined();
	});
});
