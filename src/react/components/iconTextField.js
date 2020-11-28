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
	onChange, error = false, helperText = '', disabled = false, label, value = '', Icon, startAdornment = undefined, testId = ''
}) {
	const classes = useStyles();

	return (
		<TextField
			disabled={disabled}
			error={error}
			helperText={helperText}
			focused={!disabled}
			fullWidth
			onChange={event => { onChange(event.target.value); }}
			InputProps={{
				notched: true,
				startAdornment: (
					<Fragment>
						<Icon color="primary" />
						<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						{startAdornment && <p>{startAdornment}</p>}
					</Fragment>
				)
			}}
			label={label}
			variant="outlined"
			value={value}
			data-testid={testId}
		/>
	);
}


IconTextField.propTypes = {
	onChange: PropTypes.func.isRequired,
	error: PropTypes.bool,
	helperText: PropTypes.string,
	label: PropTypes.string.isRequired,
	disabled: PropTypes.bool.isRequired,
	value: PropTypes.string,
	Icon: PropTypes.node.isRequired,
	startAdornment: PropTypes.string,
	testId: PropTypes.string
};

export default IconTextField;
