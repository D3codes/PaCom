import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Button, makeStyles, TextField, Divider
} from '@material-ui/core';
import { Folder } from '@material-ui/icons';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
	browseContainer: {
		display: 'flex'
	},
	browseIcon: {
		color: theme.palette.primary.main
	},
	button: {
		marginLeft: theme.spacing(2),
		height: '100%'
	},
	padding: {
		paddingBottom: 23
	},
	undoPadding: {
		height: 'calc(100% - 23px)'
	},
	adornmentDivider: {
		margin: theme.spacing()
	}
}));

function BrowseFile({
	onBrowseClick, filePath = '', label = '', disabled = false, error = false, helperText = '', onFilePathChange
}) {
	const classes = useStyles();
	return (
		<div className={clsx(classes.browseContainer, { [classes.padding]: !helperText })}>
			<TextField
				disabled={disabled}
				error={error}
				helperText={helperText}
				focused={!disabled}
				fullWidth
				data-testid="browse-field"
				onChange={event => { onFilePathChange(event.target.value); }}
				InputProps={{
					notched: true,
					startAdornment: (
						<Fragment>
							<Folder color="primary" />
							<Divider className={classes.adornmentDivider} orientation="vertical" flexItem />
						</Fragment>
					)
				}}
				label={label}
				variant="outlined"
				value={filePath}
			/>
			<span>
				<Button
					className={clsx(classes.button, { [classes.undoPadding]: helperText })}
					color="primary"
					onClick={onBrowseClick}
					disabled={disabled}
					variant={disabled ? 'outlined' : 'contained'}>
						Browse
				</Button>
			</span>
		</div>
	);
}

BrowseFile.propTypes = {
	onBrowseClick: PropTypes.func.isRequired,
	filePath: PropTypes.string,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	error: PropTypes.bool,
	helperText: PropTypes.string,
	onFilePathChange: PropTypes.func.isRequired
};

export default BrowseFile;
