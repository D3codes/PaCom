import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	Divider, Drawer, List, ListItem, ListItemText, makeStyles, Typography, Collapse, ListItemIcon
} from '@material-ui/core';
import {
	PermPhoneMsg, PersonPin, RateReview, Settings, ExpandMore, Schedule
} from '@material-ui/icons';
import AlertSnackbar from './alertSnackbar';

import getVersion from '../utilities/getVersion';
import persistentStorage from '../utilities/persistentStorage';

export const DRAWER_OPEN_WIDTH = 280;

const PRIMARY_TABS = [
	{
		Icon: Schedule,
		id: 'sndApptRmdrs',
		label: 'Send Appointment Reminders',
		title: 'Send Appointment Reminders'
	},
	{
		Icon: PermPhoneMsg,
		id: 'sndCstmMsg',
		label: 'Send Custom Message',
		title: 'Send Custom Message'
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
	}
];

const SETTINGS_TAB = {
	Icon: Settings,
	id: 'stngs',
	label: 'Settings'
};

export const SUBSETTINGS_TABS = [
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
	drawer: {
		width: DRAWER_OPEN_WIDTH,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	icon: {
		fontSize: '2rem'
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	versionContainer: {
		position: 'fixed',
		bottom: 0,
		alignSelf: 'center',
		paddingBottom: theme.spacing(),
		cursor: 'default',
		userSelect: 'none'
	},
	nested: {
		paddingLeft: theme.spacing(4)
	}
}));

export default function MiniDrawer({
	onTabSelect, selectedTabId = PRIMARY_TABS[0].id, settingsOpen = false
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

	useEffect(() => {
		getVersion().then(setVersion);
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
			className={classes.drawer}>
			<div className={classes.toolbar} />
			<Divider />
			<List>
				{PRIMARY_TABS.map(({ Icon, id, label }) => (
					<ListItem button key={id} onClick={() => onTabSelect(id)} selected={id === selectedTabId}>
						<ListItemIcon>
							<Icon className={classes.icon} />
						</ListItemIcon>
						<ListItemText primary={label} />
					</ListItem>
				))}
			</List>
			{adminAccess && (
				<Fragment>
					<Divider />
					<List>
						{SECONDARY_TABS.map(({ Icon, id, label }) => (
							<ListItem button key={id} onClick={() => onTabSelect(id)} selected={id === selectedTabId}>
								<ListItemIcon className={classes.icon}>
									<Icon />
								</ListItemIcon>
								<ListItemText primary={label} />
							</ListItem>
						))}
						<ListItem button onClick={() => onTabSelect(SETTINGS_TAB.id)} selected={!settingsOpen && SUBSETTINGS_TABS.some(subtab => subtab.id === selectedTabId)}>
							<ListItemIcon>
								<SETTINGS_TAB.Icon className={classes.icon} />
							</ListItemIcon>
							<ListItemText primary={SETTINGS_TAB.label} />
							<ListItemIcon>
								<ExpandMore className={clsx(classes.collapsed, { [classes.expanded]: settingsOpen })} />
							</ListItemIcon>
						</ListItem>
						<Collapse in={settingsOpen} timeout="auto" unmountOnExit>
							<List disablePadding>
								{SUBSETTINGS_TABS.map(({ id, label }) => (
									<ListItem button key={id} onClick={() => onTabSelect(id)} selected={id === selectedTabId} className={classes.nested}>
										<ListItemText primary={label} />
									</ListItem>
								))}
								<ListItem
									button
									key="disableAdminAccess"
									onClick={handleAdminDisable}
									className={classes.nested}>
									<ListItemText primary="Disable Admin Access" primaryTypographyProps={{ color: 'error' }} />
								</ListItem>
							</List>
						</Collapse>
					</List>
				</Fragment>
			)}
			<div className={classes.versionContainer}>
				{version && <Typography onClick={handleVersionClick} color="textSecondary" variant="caption">{version}</Typography>}
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
	selectedTabId: PropTypes.string,
	settingsOpen: PropTypes.bool.isRequired
};

MiniDrawer.Tabs = PRIMARY_TABS.concat(SECONDARY_TABS).concat(SUBSETTINGS_TABS);

MiniDrawer.TabIds = {
	SEND_APPOINTMENT_REMINDERS: PRIMARY_TABS[0].id,
	SEND_CUSTOM_MESSAGE: PRIMARY_TABS[1].id,
	PROVIDER_MAPPINGS: SECONDARY_TABS[0].id,
	MESSAGE_TEMPLATES: SECONDARY_TABS[1].id,
	SETTINGS: SETTINGS_TAB.id,
	APPOINTMENT_REMINDERS_SETTINGS: SUBSETTINGS_TABS[0].id,
	CUSTOM_MESSAGE_SETTINGS: SUBSETTINGS_TABS[1].id,
	MESSAGE_REPORT_SETTINGS: SUBSETTINGS_TABS[2].id,
	TWILIO_SETTINGS: SUBSETTINGS_TABS[3].id,
	SHARED_CONFIGURATION_SETTINGS: SUBSETTINGS_TABS[4].id
};
