import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import palette from './palette';
import shape from './shape';
import typography from './typography';
import mixins from './mixins';

// eslint-disable-next-line import/no-mutable-exports
const theme = createMuiTheme({
	palette,
	typography,
	shape,
	mixins
});

const overrides = {
	MuiDrawer: {
		paper: {
			backgroundColor: '#18202c'
		}
	},
	MuiButton: {
		label: {
			textTransform: 'none'
		},
		contained: {
			boxShadow: 'none',
			'&:active': {
				boxShadow: 'none'
			}
		}
	},
	MuiTabs: {
		root: {
			marginLeft: theme.spacing(0)
		},
		indicator: {
			height: 3,
			borderTopLeftRadius: 3,
			borderTopRightRadius: 3,
			backgroundColor: theme.palette.common.white
		}
	},
	MuiTab: {
		root: {
			textTransform: 'none',
			margin: '0 16px',
			minWidth: 0,
			padding: 0,
			[theme.breakpoints.up('md')]: {
				padding: 0,
				minWidth: 0
			}
		}
	},
	MuiIconButton: {
		root: {
			padding: theme.spacing()
		}
	},
	MuiTooltip: {
		tooltip: {
			borderRadius: 4
		}
	},
	MuiDivider: {
		root: {
			backgroundColor: '#404854'
		}
	},
	MuiListItem: {
		gutters: {
			paddingRight: theme.spacing(1.5),
			paddingLeft: theme.spacing(1.5)
		}
	},
	MuiListItemText: {
		primary: {
			fontWeight: theme.typography.fontWeightMedium,
			fontSize: 14
		},
		inset: {
			paddingLeft: 28
		}
	},
	MuiListItemIcon: {
		root: {
			marginRight: theme.spacing(),
			minWidth: 0,
			'& svg': {
				fontSize: 20
			}
		}
	}
};

export default { ...theme, overrides };
