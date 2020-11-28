import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Divider, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	adornmentDivider: {
		margin: theme.spacing()
	}
}));

function IconTextField({
	onChange, error = '', helperText = '', disabled = false, label, value = '', Icon
}) {
	const classes = useStyles();

	return (
		<TextField
			disabled={disabled}
			error={error}
			helperText={helperText}
			focused={!disabled}
			fullWidth
			data-testid="browse-field"
			onChange={event => { onChange(event.target.value); }}
			InputProps={{
				notched: true,
				startAdornment: (
					<Fragment>
						<Icon color="primary" />
						<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
					</Fragment>
				)
			}}
			label={label}
			variant="outlined"
			value={value}
		/>
	);
}


IconTextField.propTypes = {
	onChange: PropTypes.func.isRequired,
	error: PropTypes.string,
	helperText: PropTypes.string,
	label: PropTypes.string.isRequired,
	disabled: PropTypes.bool.isRequired,
	value: PropTypes.string,
	Icon: PropTypes.node.isRequired
};

export default IconTextField;
