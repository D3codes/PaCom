import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	Drawer, makeStyles, Typography, Button, Backdrop
} from '@material-ui/core';
import {
	PermPhoneMsg, PersonPin, RateReview, Schedule, DynamicFeed
} from '@material-ui/icons';
import AlertSnackbar from '../alertSnackbar';
import useAsyncError from '../../errors/asyncError';

import getVersion from '../../utilities/getVersion';
import persistentStorage from '../../utilities/persistentStorage';
import CategorySection from './categorySection';

import PaComLogo from '../../../logo.png';

export const DRAWER_WIDTH = 206;

const PRIMARY_TABS = [
	{
		Icon: Schedule,
		id: 'sndApptRmdrs',
		label: 'Appointment Reminders',
		title: 'Appointment Reminders'
	},
	{
		Icon: PermPhoneMsg,
		id: 'sndCstmMsg',
		label: 'Custom Messages',
		title: 'Custom Messages'
	}
];

const SECONDARY_TABS = [
	{
		Icon: PersonPin,
		id: 'prvdrMpngs',
		label: 'Provider Mappings',
		title: 'Provider Mappings'
	},
	{
		Icon: RateReview,
		id: 'msgTmplts',
		label: 'Message Templates',
		title: 'Message Templates'
	},
	{
		Icon: DynamicFeed,
		id: 'dynVals',
		label: 'Dynamic Values',
		title: 'Dynamic Values'
	}
];

export const SETTINGS_TABS = [
	{
		id: 'aptRmndrs',
		label: 'Appointment Reminders',
		title: 'Settings | Appointment Reminders'
	},
	{
		id: 'cstmMsg',
		label: 'Custom Messages',
		title: 'Settings | Custom Messages'
	},
	{
		id: 'msgRpts',
		label: 'Message Reports',
		title: 'Settings | Message Reports'
	},
	{
		id: 'twilio',
		label: 'Twilio',
		title: 'Settings | Twilio'
	},
	{
		id: 'shrDta',
		label: 'Shared Configuration',
		title: 'Settings | Shared Configuration'
	}
];

const useStyles = makeStyles(theme => ({
	buttonWrapper: {
		color: theme.palette.error.main,
		marginBottom: theme.spacing()
	},
	drawer: {
		width: DRAWER_WIDTH,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerPaper: {
		width: 'inherit'
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	bottomContainer: {
		position: 'fixed',
		bottom: 0,
		paddingBottom: theme.spacing(),
		width: 'inherit'
	},
	version: {
		color: theme.palette.text.darkContrast,
		cursor: 'default',
		userSelect: 'none',
		display: 'flex',
		justifyContent: 'center'
	},
	name: {
		color: theme.palette.text.darkContrast,
		marginLeft: theme.spacing()
	},
	backdrop: {
		position: 'absolute',
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	}
}));

export default function MiniDrawer({
	onTabSelect, disableNavigation, selectedTabId = PRIMARY_TABS[0].id
}) {
	const classes = useStyles();
	const [version, setVersion] = useState(null);
	const [clickCount, setClickCount] = useState(0);
	const [showSnackbar, setShowSnackBar] = useState(false);
	const [adminAccess, setAdminAccess] = useState(false);
	const [closeSnackbarCount, setCloseSnackbarCount] = useState(0);

	const CLICKS_REQUIRED_FOR_ADMIN_ACCESS = 20;
	const CLICKS_REQUIRED_FOR_SNACKBAR = 5;
	const CLOSE_SNACKBAR_OFFSET = CLICKS_REQUIRED_FOR_SNACKBAR + 3;

	const throwError = useAsyncError();

	useEffect(() => {
		getVersion().then(setVersion).catch(e => throwError(e));
		persistentStorage.getSettings(true).then(settings => {
			setAdminAccess(settings.adminAccess);
		});
	}, []);

	const handleSnackbarClose = () => {
		setShowSnackBar(closeSnackbarCount === clickCount - CLOSE_SNACKBAR_OFFSET && clickCount < CLICKS_REQUIRED_FOR_ADMIN_ACCESS);
		setCloseSnackbarCount(prevCount => prevCount + 1);
	};

	const handleVersionClick = () => {
		if (clickCount === 0) {
			setTimeout(() => {
				setClickCount(0);
				setCloseSnackbarCount(0);
			}, 30000);
		}

		setClickCount(prevCount => prevCount + 1);
		setShowSnackBar(!adminAccess && clickCount > CLICKS_REQUIRED_FOR_SNACKBAR && clickCount < CLICKS_REQUIRED_FOR_ADMIN_ACCESS - 1);

		if (!adminAccess && clickCount >= CLICKS_REQUIRED_FOR_ADMIN_ACCESS - 1) {
			persistentStorage.setAdminAccess(true).then(setAdminAccess);
		}
	};

	const handleAdminDisable = () => {
		persistentStorage.setAdminAccess(false).then(setAdminAccess);
		onTabSelect(PRIMARY_TABS[0].id);
	};

	return (
		<Drawer
			variant="permanent"
			classes={{ paper: classes.drawerPaper }}
			className={classes.drawer}>
			<Backdrop data-testid="backdrop" open={disableNavigation} className={classes.backdrop} />
			<div className={classes.toolbar}>
				<img height="32" src={PaComLogo} alt="PaCom Logo" />
				<Typography className={classes.name} variant="h6">PaCom</Typography>
			</div>
			<CategorySection
				items={PRIMARY_TABS}
				onItemSelect={onTabSelect}
				selectedItemId={selectedTabId}
				title="Send"
			/>
			{adminAccess && (
				<Fragment>
					<CategorySection
						items={SECONDARY_TABS}
						onItemSelect={onTabSelect}
						selectedItemId={selectedTabId}
						title="Create"
					/>
					<CategorySection
						inset
						items={SETTINGS_TABS}
						onItemSelect={onTabSelect}
						selectedItemId={selectedTabId}
						title="Settings"
					/>
				</Fragment>
			)}
			<div className={classes.bottomContainer}>
				{adminAccess && (
					<div className={classes.buttonWrapper}>
						<Button color="inherit" fullWidth onClick={handleAdminDisable}>Disable Admin Access</Button>
					</div>
				)}
				{version && (
					<div>
						<Typography
							className={classes.version}
							onClick={handleVersionClick}
							variant="caption">
							{version}
						</Typography>
					</div>
				)}
			</div>
			<AlertSnackbar
				open={showSnackbar}
				autoHideDuration={6000}
				onClose={handleSnackbarClose}
				severity={AlertSnackbar.Severities.Info}
				message={`Click ${20 - clickCount} more time${20 - clickCount === 1 ? '' : 's'} to enable admin access`}
			/>
		</Drawer>
	);
}

MiniDrawer.propTypes = {
	onTabSelect: PropTypes.func.isRequired,
	disableNavigation: PropTypes.bool.isRequired,
	selectedTabId: PropTypes.string
};

MiniDrawer.Tabs = PRIMARY_TABS.concat(SECONDARY_TABS).concat(SETTINGS_TABS);

MiniDrawer.TabIds = {
	SEND_APPOINTMENT_REMINDERS: PRIMARY_TABS[0].id,
	SEND_CUSTOM_MESSAGE: PRIMARY_TABS[1].id,
	PROVIDER_MAPPINGS: SECONDARY_TABS[0].id,
	MESSAGE_TEMPLATES: SECONDARY_TABS[1].id,
	DYNAMIC_VALUES: SECONDARY_TABS[2].id,
	APPOINTMENT_REMINDERS_SETTINGS: SETTINGS_TABS[0].id,
	CUSTOM_MESSAGE_SETTINGS: SETTINGS_TABS[1].id,
	MESSAGE_REPORT_SETTINGS: SETTINGS_TABS[2].id,
	TWILIO_SETTINGS: SETTINGS_TABS[3].id,
	SHARED_CONFIGURATION_SETTINGS: SETTINGS_TABS[4].id
};
