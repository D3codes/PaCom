import React, { useState } from 'react';
import clsx from 'clsx';
import {
	AppBar, CssBaseline, makeStyles, Toolbar, Typography
} from '@material-ui/core';

import AppointmentReminders from './components/appointmentReminders/appointmentReminders';
import CustomMessage from './components/customMessage/customMessage';
import MessageTemplates from './components/messageTemplates/messageTemplates';
import MiniDrawer, { DRAWER_OPEN_WIDTH, DRAWER_CLOSED_WIDTH } from './components/miniDrawer';
import ProviderMappings from './components/providerMappings/providerMappings';
import Settings from './components/settings/settings';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
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

	const handleChevronClick = () => {
		setOpen(!open);
	};

	const title = getTitle(selectedTabId);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<MiniDrawer
				open={open}
				onChevronClick={handleChevronClick}
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
				<div className={getClassNameForTab(selectedTabId, MiniDrawer.TabIds.SETTINGS, classes)}>
					<Settings />
				</div>
			</main>
		</div>
	);
}
