import React from 'react';
import clsx from 'clsx';
import {
	makeStyles, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	firstTableCellHead: {
		borderTopLeftRadius: 4
	},
	lastTableCellHead: {
		borderTopRightRadius: 4
	},
	statusText: {
		paddingLeft: theme.spacing()
	},
	tableCellHead: {
		padding: theme.spacing(1, 0),
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.common.white
	},
	tableHeaderText: {
		fontWeight: theme.typography.fontWeightBold
	}
}));

function ReportTableHeader() {
	const classes = useStyles();
	return (
		<TableHead>
			<TableRow>
				<TableCell className={clsx(classes.tableCellHead, classes.firstTableCellHead)}>
					<Typography className={clsx(classes.tableHeaderText, classes.statusText)} color="inherit">
						Status
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit">
						Time
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit">
						Duration
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit">
						Procedure
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit">
						Patient
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit">
						Account
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit">
						Notify By
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit">
						Home
					</Typography>
				</TableCell>
				<TableCell className={clsx(classes.tableCellHead, classes.lastTableCellHead)}>
					<Typography className={classes.tableHeaderText} color="inherit">
						Cell
					</Typography>
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

export default ReportTableHeader;
