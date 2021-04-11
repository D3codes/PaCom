import React from 'react';
import PropTypes from 'prop-types';

function FriendlyErrorPage({ errorInfo = null }) {
	return (
		<div>
			<div className="card-header">
				<p>There was an error in PaCom.</p>
			</div>
			<div>
				<details className="error-details">
					<summary>Click for error details</summary>
					{errorInfo && errorInfo.componentStack.toString()}
				</details>
			</div>
		</div>
	);
}

FriendlyErrorPage.propTypes = {
	errorInfo: PropTypes.string
};

export default FriendlyErrorPage;
