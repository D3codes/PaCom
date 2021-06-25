import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
	Typography, List, ListItem, ListItemText, Card, Checkbox, Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Provider from '../../models/provider';
import Procedure from '../../models/procedure';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		height: '100%'
	},
	listLabelContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingRight: theme.spacing()
	},
	listContainer: {
		height: '90%',
		width: `calc(50% - ${theme.spacing()}px)`
	},
	card: {
		overflowY: 'hidden',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	list: {
		width: '100%',
		overflowY: 'auto',
		height: '100%'
	},
	placeholderText: {
		fontStyle: 'italic',
		color: theme.palette.text.secondary
	}
}));

export default function SendTo({
	providerMappings, procedureMappings, onProvidersChange, onProceduresChange, hasWritePermission, forAppointmentReminders = false
}) {
	const classes = useStyles();
	const allProviders = useMemo(() => (!providerMappings.some(provider => (forAppointmentReminders ? !provider.sendToReminder : !provider.sendToCustom))), [providerMappings]);
	const allProcedures = useMemo(() => (
		!procedureMappings.some(procedure => (forAppointmentReminders ? !procedure.sendToReminder : !procedure.sendToCustom))
	), [procedureMappings]);

	const handleSelectAllProviders = () => {
		const updatedProviders = providerMappings.map(p => new Provider(
			p.source,
			p.target,
			p.phonetic,
			forAppointmentReminders ? !allProviders : p.sendToReminder,
			!forAppointmentReminders ? !allProviders : p.sendToCustom
		));
		onProvidersChange(updatedProviders);
	};

	const handleSelectAllProcedures = () => {
		const updatedProcedures = procedureMappings.map(p => new Procedure(
			p.source,
			p.target,
			p.phonetic,
			p.phoneReminder,
			p.smsReminder,
			forAppointmentReminders ? !allProcedures : p.sendToReminder,
			!forAppointmentReminders ? !allProcedures : p.sendToCustom
		));
		onProceduresChange(updatedProcedures);
	};

	const handleProviderChange = (providerSource, isChecked) => {
		const updatedProviders = providerMappings.map(p => new Provider(
			p.source,
			p.target,
			p.phonetic,
			(forAppointmentReminders && p.source === providerSource) ? isChecked : p.sendToReminder,
			(!forAppointmentReminders && p.source === providerSource) ? isChecked : p.sendToCustom
		));
		onProvidersChange(updatedProviders);
	};

	const handleProcedureChange = (procedureSource, isChecked) => {
		const updatedProcedures = procedureMappings.map(p => new Procedure(
			p.source,
			p.target,
			p.phonetic,
			p.phoneReminder,
			p.smsReminder,
			(forAppointmentReminders && p.source === procedureSource) ? isChecked : p.sendToReminder,
			(!forAppointmentReminders && p.source === procedureSource) ? isChecked : p.sendToCustom
		));
		onProceduresChange(updatedProcedures);
	};

	return (
		<div className={classes.root}>
			<div className={classes.listContainer}>
				<div className={classes.listLabelContainer}>
					<Typography variant="h6">Providers</Typography>
					<Button
						color="primary"
						disabled={!hasWritePermission || !providerMappings?.length}
						onClick={handleSelectAllProviders}>
						{`${allProviders ? 'Deselect' : 'Select'} All`}
					</Button>
				</div>
				<Card className={classes.card}>
					{providerMappings?.length > 0 && (
						<List className={classes.list}>
							{providerMappings.map(provider => (
								<ListItem key={`${provider.source}-${provider.sendToReminder}-${provider.sendToCustom}`} divider>
									<ListItemText primary={provider.target || provider.source} />
									<Checkbox
										data-testid={`providerCheckbox-${provider.target || provider.source}`}
										onChange={event => { handleProviderChange(provider.source, event.target.checked); }}
										checked={forAppointmentReminders ? provider.sendToReminder : provider.sendToCustom}
										color="secondary"
										disabled={!hasWritePermission}
									/>
								</ListItem>
							))}
						</List>
					)}
					{!providerMappings?.length && <Typography className={classes.placeholderText}>No Provider Mappings Configured</Typography>}
				</Card>
			</div>
			<div className={classes.listContainer}>
				<div className={classes.listLabelContainer}>
					<Typography variant="h6">Procedures</Typography>
					<Button
						color="primary"
						disabled={!hasWritePermission || !procedureMappings?.length}
						onClick={handleSelectAllProcedures}>
						{`${allProcedures ? 'Deselect' : 'Select'} All`}
					</Button>
				</div>
				<Card className={classes.card}>
					{procedureMappings?.length > 0 && (
						<List className={classes.list}>
							{procedureMappings.map(procedure => (
								<ListItem key={`${procedure.source}-${procedure.sendToReminder}-${procedure.sendToCustom}`} divider>
									<ListItemText primary={procedure.target || procedure.source} />
									<Checkbox
										data-testid={`procedureCheckbox-${procedure.target || procedure.source}`}
										onChange={event => { handleProcedureChange(procedure.source, event.target.checked); }}
										checked={forAppointmentReminders ? procedure.sendToReminder : procedure.sendToCustom}
										color="secondary"
										disabled={!hasWritePermission}
									/>
								</ListItem>
							))}
						</List>
					)}
					{!procedureMappings?.length && <Typography className={classes.placeholderText}>No Procedure Mappings Configured</Typography>}
				</Card>
			</div>
		</div>
	);
}

SendTo.propTypes = {
	providerMappings: PropTypes.arrayOf(PropTypes.instanceOf(Provider)).isRequired,
	procedureMappings: PropTypes.arrayOf(PropTypes.instanceOf(Procedure)).isRequired,
	onProvidersChange: PropTypes.func.isRequired,
	onProceduresChange: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool.isRequired,
	forAppointmentReminders: PropTypes.bool
};
