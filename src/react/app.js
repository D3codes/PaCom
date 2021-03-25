import React, { useState } from 'react';
import {
	AppBar, CssBaseline, makeStyles, Toolbar, Typography
} from '@material-ui/core';

import AppointmentReminders from './components/appointmentReminders/appointmentReminders';
import CustomMessage from './components/customMessage/customMessage';
import MessageTemplates from './components/messageTemplates/messageTemplates';
import MiniDrawer, { DRAWER_WIDTH } from './components/drawer/miniDrawer';
import ProviderMappings from './components/providerMappings/providerMappings';
import DynamicValues from './components/dynamicValues/dynamicValues';
import Settings from './components/settings/settings';

const useStyles = makeStyles(theme => ({
	content: {
		display: 'flex',
		height: '100%',
		overflow: 'hidden'
	},
	appBar: {
		marginLeft: DRAWER_WIDTH,
		width: `calc(100% - ${DRAWER_WIDTH}px)`
	},
	container: {
		height: '100%'
	},
	main: {
		flexGrow: 1,
		padding: theme.spacing(3),
		height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`
	},
	toolbar: {
		minHeight: theme.mixins.toolbar.minHeight
	}
}));

function getTitle(tabId) {
	const foundTab = MiniDrawer.Tabs.find(tab => tab.id === tabId);
	return foundTab ? foundTab.title : '';
}

export default function App() {
	const classes = useStyles();
	const [selectedTabId, setSelectedTabId] = useState(MiniDrawer.Tabs[0].id);
	const [disableNavigation, setDisableNavigation] = useState(false);

	const title = getTitle(selectedTabId);

	return (
		<div className={classes.content}>
			<CssBaseline />
			<MiniDrawer onTabSelect={setSelectedTabId} disableNavigation={disableNavigation} selectedTabId={selectedTabId} />
			<AppBar
				position="fixed"
				className={classes.appBar}>
				<Toolbar>
					<Typography variant="h6" noWrap>
						{title}
					</Typography>
				</Toolbar>
			</AppBar>
			<main className={classes.main}>
				<div className={classes.toolbar} />
				{selectedTabId === MiniDrawer.TabIds.SEND_APPOINTMENT_REMINDERS && (
					<AppointmentReminders disableNavigation={disableNavigation} onDisableNavigationChange={setDisableNavigation} />
				)}
				{selectedTabId === MiniDrawer.TabIds.SEND_CUSTOM_MESSAGE && <CustomMessage />}
				{selectedTabId === MiniDrawer.TabIds.PROVIDER_MAPPINGS && <ProviderMappings />}
				{selectedTabId === MiniDrawer.TabIds.MESSAGE_TEMPLATES && <MessageTemplates />}
				{selectedTabId === MiniDrawer.TabIds.DYNAMIC_VALUES && <DynamicValues />}
				<Settings selectedTabId={selectedTabId} />
			</main>
		</div>
	);
}
