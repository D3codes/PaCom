import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	buttonContent: {
		display: 'flex',
		flexDirection: 'column'
	},
	button: {
		marginTop: theme.spacing(),
		marginBottom: theme.spacing(),
		width: '100%'
	},
	adornmentDivider: {
		margin: theme.spacing()
	},
	buttonRoot: {
		textTransform: 'none',
		justifyContent: 'flex-start',
		textAlign: 'left'
	},
	invisibleOutline: {
		borderColor: 'rgba(0,0,0,0)',
		'&:hover': {
			borderColor: 'rgba(0,0,0,0)'
		}
	}
}));

function CustomButton({
	onClick, disabled, selected, title, description, children
}) {
	const classes = useStyles();

	return (
		<Button
			onClick={() => { onClick(); }}
			className={classes.button}
			disabled={disabled}
			color="primary"
			classes={{ root: classes.buttonRoot, outlinedPrimary: selected ? '' : classes.invisibleOutline }}
			variant="outlined"
			startIcon={(
				<Fragment>
					{children}
					<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
				</Fragment>
			)}>
			<div className={classes.buttonContent}>
				<Typography variant="h5">{title}</Typography>
				<Typography>{description}</Typography>
			</div>
		</Button>
	);
}


CustomButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	selected: PropTypes.bool.isRequired,
	title: PropTypes.string,
	description: PropTypes.string,
	children: PropTypes.element
};

export default CustomButton;
