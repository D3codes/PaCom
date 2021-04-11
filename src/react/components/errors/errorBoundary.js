import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FriendlyErrorPage from './friendlyErrorPage';
import logger from '../../utilities/logger';
import guidGenerator from '../../utilities/guidGenerator';

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorInfo: '',
			guid: '',
			hasError: false
		};
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		const guid = guidGenerator.uuidv4();
		logger.logError({ guid, error, errorInfo });
		this.setState({ errorInfo, guid });
	}

	render() {
		const { hasError, errorInfo, guid } = this.state;
		const { children } = this.props;

		if (hasError) {
			return <FriendlyErrorPage errorInfo={errorInfo} guid={guid} />;
		}

		return children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
};
