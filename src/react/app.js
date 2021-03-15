import React, { useState } from 'react';
import {
	AppBar, CssBaseline, makeStyles, Toolbar, Typography, ThemeProvider
} from '@material-ui/core';

import AppointmentReminders from './components/appointmentReminders/appointmentReminders';
import CustomMessage from './components/customMessage/customMessage';
import MessageTemplates from './components/messageTemplates/messageTemplates';
import MiniDrawer, { DRAWER_OPEN_WIDTH } from './components/miniDrawer';
import ProviderMappings from './components/providerMappings/providerMappings';
import Settings from './components/settings/settings';
import paComTheme from './theme';

const useStyles = makeStyles(theme => ({
	main: {
		display: 'flex',
		height: '100%'
	},
	appBar: {
		marginLeft: DRAWER_OPEN_WIDTH,
		width: `calc(100% - ${DRAWER_OPEN_WIDTH}px)`
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
	const foundTab = MiniDrawer.Tabs.find(tab => tab.id === tabId);
	return foundTab ? foundTab.title : '';
}

function getClassNameForTab(selectedTabId, tabId, classes) {
	return tabId === selectedTabId ? classes.showContainer : classes.hideContainer;
}

export default function App() {
	const classes = useStyles();
	const [selectedTabId, setSelectedTabId] = useState(MiniDrawer.Tabs[0].id);
	const [settingsOpen, setSettingsOpen] = useState(false);

	const handleTabSelect = tabId => {
		const isSettingsTab = tabId === MiniDrawer.TabIds.SETTINGS;
		if (!isSettingsTab) setSelectedTabId(tabId);
		if (isSettingsTab) setSettingsOpen(prevSettingsOpen => !prevSettingsOpen);
	};

	const title = getTitle(selectedTabId);

	return (
		<ThemeProvider theme={paComTheme}>
			<div className={classes.main}>
				<CssBaseline />
				<MiniDrawer
					onTabSelect={handleTabSelect}
					selectedTabId={selectedTabId}
					settingsOpen={settingsOpen}
				/>
				<AppBar
					position="fixed"
					className={classes.appBar}>
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
					<Settings selectedTabId={selectedTabId} />
				</main>
			</div>
		</ThemeProvider>
	);
}
