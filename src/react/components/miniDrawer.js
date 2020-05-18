import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	Divider, Drawer, IconButton, List, ListItem, ListItemText, makeStyles, Typography
} from '@material-ui/core';
import {
	AddComment, AlarmAdd, ChevronRight, EditLocation, RateReview, Settings
} from '@material-ui/icons';

import getVersion from '../utilities/getVersion';
import usePromise from '../hooks/usePromise';

export const DRAWER_OPEN_WIDTH = 300;
export const DRAWER_CLOSED_WIDTH = 65;

const PRIMARY_TABS = [
	{
		Icon: AlarmAdd,
		id: 'sndApptRmdrs',
		label: 'Send Appointment Reminders'
	},
	{
		Icon: AddComment,
		id: 'sndCstmMsg',
		label: 'Send Custom Message'
	}
];

const SECONDARY_TABS = [
	{
		Icon: EditLocation,
		id: 'prvdrMpngs',
		label: 'Provider Mappings'
	},
	{
		Icon: RateReview,
		id: 'msgTmplts',
		label: 'Message Templates'
	},
	{
		Icon: Settings,
		id: 'stngs',
		label: 'Settings'
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
	}
}));

export default function MiniDrawer({
	open = false, onChevronClick, onTabSelect, selectedTabId = PRIMARY_TABS[0].id
}) {
	const classes = useStyles();
	const [version] = usePromise(() => getVersion());

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
			}}
		>
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
			<Divider />
			<List>
				{SECONDARY_TABS.map(({ Icon, id, label }) => (
					<ListItem button key={id} onClick={() => onTabSelect(id)} selected={id === selectedTabId}>
						<Icon className={classes.icon} color="primary" />
						<ListItemText primary={label} />
					</ListItem>
				))}
			</List>
			<div className={classes.versionContainer}>
				{version && <Typography color="textSecondary" variant="caption">{version}</Typography>}
			</div>
		</Drawer>
	);
}

MiniDrawer.propTypes = {
	open: PropTypes.bool,
	onChevronClick: PropTypes.func.isRequired,
	onTabSelect: PropTypes.func.isRequired,
	selectedTabId: PropTypes.string
};

MiniDrawer.Tabs = PRIMARY_TABS.concat(SECONDARY_TABS);

MiniDrawer.TabIds = {
	SEND_APPOINTMENT_REMINDERS: PRIMARY_TABS[0].id,
	SEND_CUSTOM_MESSAGE: PRIMARY_TABS[1].id,
	PROVIDER_MAPPINGS: SECONDARY_TABS[0].id,
	MESSAGE_TEMPLATES: SECONDARY_TABS[1].id,
	SETTINGS: SECONDARY_TABS[2].id
};
