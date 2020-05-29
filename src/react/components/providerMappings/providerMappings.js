import React, { useState } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import Add from '@material-ui/icons/Add';

import ProviderMappingsTable from './providerMappingsTable';

const useStyles = makeStyles(() => ({
	buttonContainer: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	noProviderMappingsContainer: {
		display: 'flex',
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	},
	noProviderMappingsText: {
		fontStyle: 'italic'
	},
	providerMappingsContainer: {
		height: '100%',
		display: 'flex',
		flexFlow: 'column'
	}
}));

export default function ProviderMappings() {
	const classes = useStyles();
	const [providers] = useState(null); // TODO: Get provider mappings from storage
	const [isAddShown, setIsAddShown] = useState(false);

	const handleAddClick = () => {
		setIsAddShown(true);
	};

	return (
		<div className={classes.providerMappingsContainer}>
			{(providers || isAddShown) && <ProviderMappingsTable isAddShown={isAddShown} providers={providers} />}
			{!(providers || isAddShown) && (
				<div className={classes.noProviderMappingsContainer}>
					<Typography className={classes.noProviderMappingsText} color="textSecondary">No Provider Mappings</Typography>
				</div>
			)}
			<div className={classes.buttonContainer}>
				<Button color="primary" endIcon={<Add />} onClick={handleAddClick} variant="contained">Add</Button>
			</div>
		</div>
	);
}
