import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FriendlyErrorPage from './friendlyErrorPage';
import logger from '../../utilities/logger';

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorInfo: '',
			hasError: false
		};
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		logger.logError({ error, errorInfo });
		this.setState({ errorInfo });
	}

	render() {
		const { hasError, errorInfo } = this.state;
		const { children } = this.props;

		if (hasError) {
			return <FriendlyErrorPage errorInfo={errorInfo} />;
		}

		return children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
};
