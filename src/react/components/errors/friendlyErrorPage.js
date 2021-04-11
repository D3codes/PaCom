import React from 'react';
import PropTypes from 'prop-types';
import { ErrorOutline } from '@material-ui/icons';
import {
	AppBar, Toolbar, Typography, makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	content: {
		display: 'flex',
		height: '100%',
		overflow: 'hidden'
	},
	appBar: {
		width: '100%'
	},
	main: {
		flexGrow: 1,
		padding: theme.spacing(3),
		height: '100%',
		backgroundColor: theme.palette.background.dark
	},
	toolbar: {
		display: 'flex',
		minHeight: theme.mixins.toolbar.minHeight
	},
	text: {
		color: theme.palette.text.darkContrast
	},
	errorTitleContainer: {
		display: 'flex',
		justifyContent: 'center'
	},
	errorTitle: {
		marginLeft: theme.spacing()
	}
}));

function FriendlyErrorPage({ guid = null }) {
	const classes = useStyles();

	return (
		<div className={classes.content}>
			<AppBar
				position="fixed"
				className={classes.appBar}>
				<Toolbar>
					<Typography variant="h6" noWrap>
                        Error
					</Typography>
				</Toolbar>
			</AppBar>
			<main className={classes.main}>
				<div className={classes.toolbar} />
				<div className={classes.errorTitleContainer}>
					<ErrorOutline color="error" fontSize="large" />
					<Typography className={classes.errorTitle} display="block" variant="h4" noWrap color="error" paragraph>
                        An Error has occurred
					</Typography>
				</div>
				<Typography className={classes.text}>
                    If this keeps happening, contact PaCom support with the following error code:
				</Typography>
				<Typography variant="h6" color="error" paragraph>{guid}</Typography>
			</main>
		</div>
	);
}

FriendlyErrorPage.propTypes = {
	guid: PropTypes.string
};

export default FriendlyErrorPage;
