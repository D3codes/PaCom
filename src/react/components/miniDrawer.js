import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	Divider, Drawer, IconButton, List, ListItem, ListItemText, makeStyles
} from '@material-ui/core';
import {
	AddComment, AlarmAdd, ChevronLeft, EditLocation, RateReview, Settings
} from '@material-ui/icons';

const DRAWER_WIDTH = 300;

const TABS = [
	{
		Icon: AlarmAdd,
		id: 'sndApptRmdrs',
		label: 'Send Appointment Reminders'
	},
	{
		Icon: AddComment,
		id: 'sndCstmMsg',
		label: 'Send Custom Message'
	},
	{
		Icon: AddComment,
		id: 'sndUppMsgs',
		label: 'Send UPP Messages'
	},
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
		width: DRAWER_WIDTH,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerOpen: {
		width: DRAWER_WIDTH,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: 'hidden',
		width: theme.spacing(6) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(8) + 1
		}
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
	}
}));

export default function MiniDrawer({
	open = false, onDrawerClose, onTabSelect, selectedTabId = TABS[0].id
}) {
	const classes = useStyles();

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
				<IconButton onClick={onDrawerClose}>
					<ChevronLeft />
				</IconButton>
			</div>
			<Divider />
			<List>
				{TABS.map(({ Icon, id, label }) => (
					<ListItem button key={id} onClick={() => onTabSelect(id)} selected={id === selectedTabId}>
						<Icon className={classes.icon} color="primary" />
						<ListItemText primary={label} />
					</ListItem>
				))}
			</List>
		</Drawer>
	);
}

MiniDrawer.propTypes = {
	open: PropTypes.bool,
	onDrawerClose: PropTypes.func.isRequired,
	onTabSelect: PropTypes.func.isRequired,
	selectedTabId: PropTypes.string
};

MiniDrawer.Tabs = TABS;

MiniDrawer.TabIds = {
	SEND_APPOINTMENT_REMINDERS: TABS[0].id,
	SEND_CUSTOM_MESSAGE: TABS[1].id,
	SEND_UPP_MESSAGES: TABS[2].id,
	PROVIDER_MAPPINGS: TABS[3].id,
	MESSAGE_TEMPLATES: TABS[4].id,
	SETTINGS: TABS[5].id
};
