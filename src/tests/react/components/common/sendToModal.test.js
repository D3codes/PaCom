import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import SendToModal from '../../../../react/components/common/sendToModal';

describe('SendToModal', () => {
	it('renders without crashing', () => {
		const { getByText } = render(<SendToModal onClose={jest.fn()} providers={[]} procedures={[]} defaultProviders={[]} defaultProcedures={[]} />);
		expect(getByText('Send To')).toBeDefined();
		expect(getByText('Restore Defaults')).toBeDefined();
		expect(getByText('Cancel')).toBeDefined();
		expect(getByText('Save')).toBeDefined();
	});
});
