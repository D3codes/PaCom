import React from 'react';
import PropTypes from 'prop-types';
import {
	Button, InputAdornment, makeStyles, TextField
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
		marginLeft: theme.spacing(2)
	},
	padding: {
		paddingBottom: 23
	}
}));

function BrowseFile({
	onBrowseClick, filePath = '', label = '', disabled = false, error = false, helperText = ''
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
				InputProps={{
					notched: true,
					startAdornment: (
						<InputAdornment className={classes.browseIcon} position="start"><Folder /></InputAdornment>
					)
				}}
				label={label}
				size="small"
				variant="outlined"
				value={filePath}
			/>
			<span>
				<Button className={classes.button} color="primary" onClick={onBrowseClick} disabled={disabled} variant={disabled ? 'outlined' : 'contained'}>Browse</Button>
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
	helperText: PropTypes.string
};

export default BrowseFile;
