import React, { useState } from 'react';
import clsx from 'clsx';
import {
	AppBar, CssBaseline, makeStyles, Toolbar, Typography, ClickAwayListener
} from '@material-ui/core';

import AppointmentReminders from './components/appointmentReminders/appointmentReminders';
import AppointmentReminderSettings from './components/settings/appointmentReminderSettings';
import CustomMessage from './components/customMessage/customMessage';
import CustomMessageSettings from './components/settings/customMessageSettings';
import MessageReportSettings from './components/settings/messageReportSettings';
import MessageTemplates from './components/messageTemplates/messageTemplates';
import MiniDrawer, { DRAWER_OPEN_WIDTH, DRAWER_CLOSED_WIDTH, SUBSETTINGS_TABS } from './components/miniDrawer';
import ProviderMappings from './components/providerMappings/providerMappings';
import SharedDataSettings from './components/settings/sharedDataSettings';
import TwilioSettings from './components/settings/twilioSettings';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		height: '100%'
	},
	appBar: {
		marginLeft: DRAWER_CLOSED_WIDTH,
		width: `calc(100% - ${DRAWER_CLOSED_WIDTH}px)`,
		transition: theme.transitions.create(['width', 'margin'])
	},
	appBarShift: {
		marginLeft: DRAWER_OPEN_WIDTH,
		width: `calc(100% - ${DRAWER_OPEN_WIDTH}px)`,
		transition: theme.transitions.create(['width', 'margin'])
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`
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
		display: 'initial',
		height: '100%'
	},
	hideContainer: {
		display: 'none'
	}
}));

function getTitle(tabId) {
	const foundTab = MiniDrawer.Tabs.find((tab) => tab.id === tabId);
	return foundTab ? foundTab.title : '';
}

function getClassNameForTab(selectedTabId, tabId, classes) {
	return tabId === selectedTabId ? classes.showContainer : classes.hideContainer;
}

export default function App() {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [selectedTabId, setSelectedTabId] = useState(MiniDrawer.Tabs[0].id);
	const [settingsOpen, setSettingsOpen] = useState(false);

	const handleChevronClick = () => {
		setOpen((prevOpen) => !prevOpen);
		setSettingsOpen((prevSettingsOpen) => !open && prevSettingsOpen && SUBSETTINGS_TABS.some((subTab) => subTab.id === selectedTabId));
	};

	const handleTabSelect = (tabId) => {
		const isSettingsTab = tabId === MiniDrawer.TabIds.SETTINGS;
		if (!isSettingsTab) setSelectedTabId(tabId);
		if (isSettingsTab) setSettingsOpen((prevSettingsOpen) => !prevSettingsOpen);
		if (!open && isSettingsTab) setOpen(true);
	};

	const title = getTitle(selectedTabId);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<ClickAwayListener onClickAway={() => { setSettingsOpen(false); setOpen(false); }}>
				<div>
					<MiniDrawer
						open={open}
						onChevronClick={handleChevronClick}
						onTabSelect={handleTabSelect}
						selectedTabId={selectedTabId}
						settingsOpen={settingsOpen}
					/>
				</div>
			</ClickAwayListener>
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}>
				<Toolbar>
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
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.PROVIDER_MAPPINGS, classes)}>
					<ProviderMappings />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.MESSAGE_TEMPLATES, classes)}>
					<MessageTemplates />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.APPOINTMENT_REMINDERS_SETTINGS, classes)}>
					<AppointmentReminderSettings />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.CUSTOM_MESSAGE_SETTINGS, classes)}>
					<CustomMessageSettings />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.MESSAGE_REPORT_SETTINGS, classes)}>
					<MessageReportSettings />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.TWILIO_SETTINGS, classes)}>
					<TwilioSettings />
				</div>
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.SHARED_DATA_SETTINGS, classes)}>
					<SharedDataSettings />
				</div>
			</main>
		</div>
	);
}
