import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
	Button, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography
} from '@material-ui/core';
import { Add, MoreVert, Save, Warning } from '@material-ui/icons';

import Provider from '../../models/provider';

const testProviders = [
	new Provider('APPOINTMENTS FOR PROVIDER: DBROW - M David Brown, MD on ', 'David Brown', 'David Brown'),
	new Provider('APPOINTMENTS FOR PROVIDER: GLAMB - Garrett D Lambert, MD on ', 'Garrett Lambert', 'Gehrhett Lambert'),
	new Provider('APPOINTMENTS FOR PROVIDER: KSONN - Kenneth N Sonnenschein, MD on ')
];

const useStyles = makeStyles(theme => ({
	buttonContainer: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	firstTableHeadCell: {
		borderTopLeftRadius: 4
	},
	lastTableHeadCell: {
		borderTopRightRadius: 4
	},
	providerMappingsContainer: {
		height: '100%',
		display: 'flex',
		flexFlow: 'column'
	},
	providerTable: {
		flex: 1
	},
	tableHeadCell: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white
	},
	warningIcon: {
		color: theme.palette.warning.main,
		paddingRight: theme.spacing()
	}
}));

export default function ProviderMappings() {
	const classes = useStyles();
	const [providers, setProviders] = useState(null);
	const [isAddShown, setIsAddShown] = useState(false);

	useEffect(() => {
		setProviders(testProviders);
	}, []);

	const handleAddClick = () => {
		setIsAddShown(true);
	};

	return (
		<div className={classes.providerMappingsContainer}>
			<div className={classes.providerTable}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell className={clsx(classes.firstTableHeadCell, classes.tableHeadCell)}>
								<Typography color="inherit">
									Convert From (Source)
								</Typography>
							</TableCell>
							<TableCell className={classes.tableHeadCell}>
								<Typography color="inherit">
									Convert To (SMS)
								</Typography>
							</TableCell>
							<TableCell className={classes.tableHeadCell}>
								<Typography color="inherit">
									Convert To (Phonetic)
								</Typography>
							</TableCell>
							<TableCell className={clsx(classes.lastTableHeadCell, classes.tableHeadCell)}>
								<Typography color="inherit">
									Actions
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{providers && providers.map(provider => (
							<TableRow key={provider.source}>
								<TableCell>
									<Typography>
										{!provider.get('target') && !provider.get('phonetic') && (
											<Warning className={classes.warningIcon} />
										)}
										{provider.get('source')}
									</Typography>
								</TableCell>
								<TableCell><Typography>{provider.get('target', '-')}</Typography></TableCell>
								<TableCell><Typography>{provider.get('phonetic', '-')}</Typography></TableCell>
								<TableCell><IconButton><MoreVert /></IconButton></TableCell>
							</TableRow>
						))}
						{isAddShown && (
							<TableRow>
								<TableCell>
									<TextField
										fullWidth
										label="Source"
										margin="dense"
										placeholder="Source..."
									/>
								</TableCell>
								<TableCell>
									<TextField
										fullWidth
										label="SMS"
										margin="dense"
										placeholder="SMS..."
									/>
								</TableCell>
								<TableCell>
									<TextField
										fullWidth
										label="Phonetic"
										margin="dense"
										placeholder="Phonetic..."
									/>
								</TableCell>
								<TableCell>
									<IconButton color="primary">
										<Save />
									</IconButton>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className={classes.buttonContainer}>
				<Button color="primary" endIcon={<Add />} onClick={handleAddClick} variant="contained">Add</Button>
			</div>
		</div>
	);
}
