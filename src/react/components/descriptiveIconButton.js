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
		width: '100%',
		'&:disabled': {
			borderColor: 'rgba(0,0,0,0)'
		}
	},
	disabledSelectedButton: {
		marginTop: theme.spacing(),
		marginBottom: theme.spacing(),
		width: '100%',
		'&:disabled': {
			border: '1px solid rgba(0,0,0,0.12)'
		}
	},
	buttonText: {
		color: theme.palette.text.primary
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

function DescriptiveIconButton({
	onClick, disabled = false, selected, title = '', description = '', Icon
}) {
	const classes = useStyles();

	return (
		<Button
			onClick={onClick}
			classes={{ root: classes.buttonRoot, outlinedSecondary: selected ? '' : classes.invisibleOutline }}
			className={disabled && selected ? classes.disabledSelectedButton : classes.button}
			disabled={disabled}
			color="secondary"
			variant="outlined"
			startIcon={(
				<Fragment>
					<Icon style={{ fontSize: '3rem', textAlign: 'left', color: selected ? '#009be5' : '#006db3' }} />
					<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
				</Fragment>
			)}>
			<div className={classes.buttonContent}>
				<Typography className={classes.buttonText} variant="h5">{title}</Typography>
				<Typography className={classes.buttonText}>{description}</Typography>
			</div>
		</Button>
	);
}

DescriptiveIconButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	selected: PropTypes.bool.isRequired,
	title: PropTypes.string,
	description: PropTypes.string,
	Icon: PropTypes.elementType.isRequired
};

export default DescriptiveIconButton;
