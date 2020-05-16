import React, { useState } from 'react';
import clsx from 'clsx';
import {
	AppBar, CssBaseline, IconButton, makeStyles, Toolbar, Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import AppointmentReminders from './components/appointmentReminders/appointmentReminders';
import CustomMessage from './components/customMessage/customMessage';
import MessageTemplates from './components/messageTemplates/messageTemplates';
import MiniDrawer from './components/miniDrawer';
import ProviderMappings from './components/providerMappings/providerMappings';
import Settings from './components/settings/settings';
import UppMessages from './components/uppMessages/uppMessages';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: 36
	},
	hide: {
		display: 'none'
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	showContainer: {
		display: 'initial'
	},
	hideContainer: {
		display: 'none'
	}
}));

function getTitle(tabId) {
	const foundTab = MiniDrawer.Tabs.find((tab) => tab.id === tabId);
	return foundTab ? foundTab.label : '';
}

function getClassNameForTab(selectedTabId, tabId, classes) {
	return tabId === selectedTabId ? classes.showContainer : classes.hideContainer;
}

export default function App() {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [selectedTabId, setSelectedTabId] = useState(MiniDrawer.Tabs[0].id);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const title = getTitle(selectedTabId);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<MiniDrawer
				open={open}
				onDrawerClose={handleDrawerClose}
				onTabSelect={setSelectedTabId}
				selectedTabId={selectedTabId}
			/>
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: open
						})}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap>
						{title}
					</Typography>
				</Toolbar>
			</AppBar>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.SEND_APPOINTMENT_REMINDERS, classes)}>
					<AppointmentReminders />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.SEND_CUSTOM_MESSAGE, classes)}>
					<CustomMessage />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.SEND_UPP_MESSAGES, classes)}>
					<UppMessages />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.PROVIDER_MAPPINGS, classes)}>
					<ProviderMappings />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.MESSAGE_TEMPLATES, classes)}>
					<MessageTemplates />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.SETTINGS, classes)}>
					<Settings />
				</div>
			</main>
		</div>
	);
}
