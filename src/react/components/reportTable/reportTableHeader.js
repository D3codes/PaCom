import React from 'react';
import clsx from 'clsx';
import {
	makeStyles, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	firstTableCellHead: {
		borderTopLeftRadius: 4
	},
	lastTableCellHead: {
		borderTopRightRadius: 4
	},
	tableCellHead: {
		padding: theme.spacing(1, 0),
		backgroundColor: theme.palette.primary.light,
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
				<TableCell align="center" className={clsx(classes.tableCellHead, classes.firstTableCellHead)}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Status
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Provider
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Date
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Time
					</Typography>
				</TableCell>
				<TableCell align="center" className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Duration
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Patient
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Account
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Date of Birth
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Notify By
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Work Phone
					</Typography>
				</TableCell>
				<TableCell className={classes.tableCellHead}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Home Phone
					</Typography>
				</TableCell>
				<TableCell className={clsx(classes.tableCellHead, classes.lastTableCellHead)}>
					<Typography className={classes.tableHeaderText} color="inherit" variant="body2">
										Cell Phone
					</Typography>
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

export default ReportTableHeader;
