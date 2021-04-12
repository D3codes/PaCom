import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/electron';
import FriendlyErrorPage from './friendlyErrorPage';
import logger from '../../utilities/logger';

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorInfo: '',
			errorCode: '',
			hasError: false
		};
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		Sentry.withScope(scope => {
			scope.setExtras(errorInfo);
			const errorCode = Sentry.captureException(error);
			logger.logError({ errorCode, error, errorInfo });
			this.setState({ errorInfo, errorCode });
		});
	}

	render() {
		const { hasError, errorInfo, errorCode } = this.state;
		const { children } = this.props;

		if (hasError) {
			return <FriendlyErrorPage errorInfo={errorInfo} errorCode={errorCode} />;
		}

		return children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
};
