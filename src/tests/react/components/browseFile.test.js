import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import BrowseFile from '../../../react/components/browseFile';

describe('BrowseFile', () => {
	it('renders without crashing', () => {
		const { container } = render(<BrowseFile />);
		expect(container.firstChild.className.includes('browseContainer')).toBe(true);
	});
});
