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

function BrowseFile({ onBrowseClick }) {
	const classes = useStyles();
	return (
		<div className={classes.browseContainer}>
			<TextField
				focused
				fullWidth
				InputProps={{
					notched: true,
					startAdornment: (
						<InputAdornment className={classes.browseIcon} position="start"><Folder /></InputAdornment>
					)
				}}
				label="Import CSV"
				size="small"
				variant="outlined"
			/>
			<Button className={classes.button} color="primary" onClick={onBrowseClick} variant="contained">Browse</Button>
		</div>
	);
}

BrowseFile.propTypes = {
	onBrowseClick: PropTypes.func.isRequired
};

export default BrowseFile;
