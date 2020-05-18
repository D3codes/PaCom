import React, { Fragment } from 'react';
import { Button, makeStyles, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	browseContainer: {
		display: 'flex'
	},
	button: {
		marginLeft: theme.spacing(2)
	}
}));

export default function AppointmentReminders() {
	const classes = useStyles();
	return (
		<div>
			<div className={classes.browseContainer}>
				<TextField focused fullWidth label="Import CSV" size="small" variant="outlined" />
					<Button className={classes.button} color="primary" variant="outlined">Browse</Button>
			</div>
		</div>
	);
}
