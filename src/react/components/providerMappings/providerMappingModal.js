import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@material-ui/core';

function ProviderMappingModal({ open = false }) {
	return (
		<Dialog fullWidth open={open}>
      Hi
		</Dialog>
	);
}

ProviderMappingModal.propTypes = {
	open: PropTypes.bool
};

export default ProviderMappingModal;
