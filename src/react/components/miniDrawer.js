import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	Divider, Drawer, IconButton, List, ListItem, ListItemText, makeStyles, Typography, Collapse, Slide, Snackbar
} from '@material-ui/core';
import {
	AddComment, AlarmAdd, ChevronRight, EditLocation, RateReview, Settings, ExpandMore
} from '@material-ui/icons';

import getVersion from '../utilities/getVersion';
import usePromise from '../hooks/usePromise';
import persistentStorage from '../utilities/persistentStorage';

export const DRAWER_OPEN_WIDTH = 300;
export const DRAWER_CLOSED_WIDTH = 65;

const PRIMARY_TABS = [
	{
		Icon: AlarmAdd,
		id: 'sndApptRmdrs',
		label: 'Send Appointment Reminders',
		title: 'Send Appointment Reminders'
	},
	{
		Icon: AddComment,
		id: 'sndCstmMsg',
		label: 'Send Custom Message',
		title: 'Send Custom Message'
	}
];

const SECONDARY_TABS = [
	{
		Icon: EditLocation,
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
		label: 'Shared Data',
		title: 'Settings | Shared Data'
	}
];

const useStyles = makeStyles((theme) => ({
	drawer: {
		width: DRAWER_OPEN_WIDTH,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerOpen: {
		width: DRAWER_OPEN_WIDTH,
		transition: theme.transitions.create('width'),
		overflowX: 'hidden'
	},
	drawerClose: {
		transition: theme.transitions.create('width'),
		overflowX: 'hidden',
		width: DRAWER_CLOSED_WIDTH
	},
	icon: {
		fontSize: '2rem',
		marginRight: theme.spacing(3)
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
		paddingBottom: theme.spacing()
	},
	collapsed: {
		transition: theme.transitions.create('transform')
	},
	expanded: {
		transform: 'rotate(-180deg)'
	},
	nested: {
		paddingLeft: theme.spacing(4)
	}
}));

export default function MiniDrawer({
	open = false, onChevronClick, onTabSelect, selectedTabId = PRIMARY_TABS[0].id, settingsOpen = false
}) {
	const classes = useStyles();
	const [version] = usePromise(() => getVersion());
	const [clickCount, setClickCount] = useState(0);
	const [showSnackbar, setShowSnackBar] = useState(false);
	const [adminAccess, setAdminAccess] = useState(false);
	const [closeSnackbarCount, setCloseSnackbarCount] = useState(0);

	useEffect(() => {
		persistentStorage.getSettings().then((settings) => {
			setAdminAccess(settings.adminAccess);
		});
	}, []);

	const handleSnackbarClose = () => {
		setShowSnackBar(closeSnackbarCount === clickCount - 8 && clickCount < 20);
		setCloseSnackbarCount((prevCount) => prevCount + 1);
	};

	const handleVersionClick = () => {
		if (clickCount === 0) {
			setTimeout(() => {
				setClickCount(0);
				setCloseSnackbarCount(0);
			}, 30000);
		}

		setClickCount((prevCount) => prevCount + 1);
		setShowSnackBar(!adminAccess && clickCount > 5 && clickCount < 19);

		if (!adminAccess && clickCount >= 19) {
			setAdminAccess(true);
			persistentStorage.setAdminAccess(true);
		}
	};

	return (
		<Drawer
			variant="permanent"
			className={clsx(classes.drawer, {
				[classes.drawerOpen]: open,
				[classes.drawerClose]: !open
			})}
			classes={{
				paper: clsx({
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open
				})
			}}>
			<div className={classes.toolbar}>
				<IconButton onClick={onChevronClick}>
					<ChevronRight className={clsx(classes.collapsed, { [classes.expanded]: open })} />
				</IconButton>
			</div>
			<Divider />
			<List>
				{PRIMARY_TABS.map(({ Icon, id, label }) => (
					<ListItem button key={id} onClick={() => onTabSelect(id)} selected={id === selectedTabId}>
						<Icon className={classes.icon} color="primary" />
						<ListItemText primary={label} />
					</ListItem>
				))}
			</List>
			{adminAccess && <Divider />}
			{adminAccess && (
				<List>
					{SECONDARY_TABS.map(({ Icon, id, label }) => (
						<ListItem button key={id} onClick={() => onTabSelect(id)} selected={id === selectedTabId}>
							<Icon className={classes.icon} color="primary" />
							<ListItemText primary={label} />
						</ListItem>
					))}
					<ListItem button onClick={() => onTabSelect(SETTINGS_TAB.id)} selected={!settingsOpen && SUBSETTINGS_TABS.some((subtab) => subtab.id === selectedTabId)}>
						<SETTINGS_TAB.Icon className={classes.icon} color="primary" />
						<ListItemText primary={SETTINGS_TAB.label} />
						<ExpandMore className={clsx(classes.collapsed, { [classes.expanded]: settingsOpen })} />
					</ListItem>
					<Collapse in={settingsOpen} timeout="auto" unmountOnExit>
						<List disablePadding>
							{SUBSETTINGS_TABS.map(({ id, label }) => (
								<ListItem button key={id} onClick={() => onTabSelect(id)} selected={id === selectedTabId} className={classes.nested}>
									<ListItemText primary={label} />
								</ListItem>
							))}
						</List>
					</Collapse>
				</List>
			)}
			<div className={classes.versionContainer}>
				{version && <Typography onClick={handleVersionClick} color="textSecondary" variant="caption">{version}</Typography>}
			</div>
			<Snackbar
				open={showSnackbar}
				autoHideDuration={6000}
				onClose={handleSnackbarClose}
				TransitionComponent={Slide}
				message={`Click ${20 - clickCount} more time${20 - clickCount === 1 ? '' : 's'} for admin access`}
			/>
		</Drawer>
	);
}

MiniDrawer.propTypes = {
	open: PropTypes.bool,
	onChevronClick: PropTypes.func.isRequired,
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
	SHARED_DATA_SETTINGS: SUBSETTINGS_TABS[4].id
};
