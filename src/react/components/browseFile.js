import React from 'react';
import PropTypes from 'prop-types';
import {
	Button, InputAdornment, makeStyles, TextField
} from '@material-ui/core';
import { Folder } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
	browseContainer: {
		display: 'flex'
	},
	browseIcon: {
		color: theme.palette.primary.main
	},
	button: {
		marginLeft: theme.spacing(2)
	}
}));

function BrowseFile({
	onBrowseClick, filePath = '', label = '', disabled = false, required = false
}) {
	const classes = useStyles();
	return (
		<div className={classes.browseContainer}>
			<TextField
				disabled={disabled}
				required={required}
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
			<Button className={classes.button} color="primary" onClick={onBrowseClick} disabled={disabled} variant={disabled ? 'outlined' : 'contained'}>Browse</Button>
		</div>
	);
}

BrowseFile.propTypes = {
	onBrowseClick: PropTypes.func.isRequired,
	filePath: PropTypes.string,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	required: PropTypes.bool
};

export default BrowseFile;
