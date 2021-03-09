import React from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@material-ui/core';
import { Folder } from '@material-ui/icons';
import clsx from 'clsx';
import IconTextField from './iconTextField';

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
		paddingBottom: 22
	},
	undoPadding: {
		height: 'calc(100% - 22px)'
	}
}));

function BrowseFile({
	onBrowseClick, filePath = '', label = '', disabled = false, error = false, helperText = '', onFilePathChange
}) {
	const classes = useStyles();
	return (
		<div className={clsx(classes.browseContainer, { [classes.padding]: !helperText })}>
			<IconTextField
				disabled={disabled}
				error={error}
				helperText={helperText}
				onChange={onFilePathChange}
				Icon={Folder}
				label={label}
				value={filePath}
				testId="browse-field"
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
