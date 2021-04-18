import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, FormControl, Select, MenuItem, Divider, Typography
} from '@material-ui/core';
import {
	Save, Input, Sms, Phone
} from '@material-ui/icons';

import Procedure from '../../models/procedure';
import Template from '../../models/template';

import { ProcedureMappingSourceInUseTitle, ProcedureMappingSourceInUseMessage } from '../../localization/en/dialogText';
import dialogController from '../../utilities/dialogController';
import IconTextField from '../iconTextField';

const useStyles = makeStyles(theme => ({
	dialogContent: {
		'& > * + *': {
			marginTop: theme.spacing(2)
		}
	},
	adornmentDivider: {
		margin: theme.spacing(),
		marginTop: theme.spacing(3)
	},
	accordionSummaryText: {
		alignSelf: 'center'
	},
	templateContainer: {
		display: 'flex',
		flex: 1,
		justifyContent: 'space-between'
	},
	templateSelector: {
		width: `calc(50% - ${theme.spacing()}px)`,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	form: {
		width: '100%'
	}
}));

function ProcedureMappingModal({
	onCancel, onSave, open = false, messageTemplates = null, procedure = null, procedures = null
}) {
	const classes = useStyles();

	const [source, setSource] = useState('');
	const [target, setTarget] = useState('');
	const [phonetic, setPhonetic] = useState('');
	const [smsReminder, setSmsReminder] = useState('');
	const [phoneReminder, setPhoneReminder] = useState('');

	useEffect(() => {
		if (open && procedure) {
			setSource(procedure.source);
			setTarget(procedure.target);
			setPhonetic(procedure.phonetic);
			setPhoneReminder(procedure.phoneReminder);
			setSmsReminder(procedure.smsReminder);
		}
	}, [open, procedure]);

	const applyInitialState = () => {
		setSource('');
		setTarget('');
		setPhonetic('');
	};

	const handleSourceChange = event => setSource(event.target.value);

	const handleTargetChange = event => setTarget(event.target.value);

	const handlePhoneticChange = event => setPhonetic(event.target.value);

	const handleCancel = () => {
		onCancel();
		applyInitialState();
	};

	const handleSave = () => {
		const existingProcedure = !procedure && procedures?.find(prov => prov.source === source);
		if (existingProcedure) {
			dialogController.confirmSave(ProcedureMappingSourceInUseTitle, ProcedureMappingSourceInUseMessage).then(({ response }) => {
				if (response === 0) {
					const newProcedureMapping = new Procedure(source, target, phonetic, phoneReminder, smsReminder);
					onSave(newProcedureMapping, procedure);
					applyInitialState();
				}
			});
		} else {
			const newProcedureMapping = new Procedure(source, target, phonetic, phoneReminder, smsReminder);
			onSave(newProcedureMapping, procedure);
			applyInitialState();
		}
	};

	const isSaveDisabled = !(source && target && phonetic);

	return (
		<Dialog fullWidth open={open}>
			<DialogTitle>{procedure ? 'Edit' : 'Add'} Procedure Mapping</DialogTitle>
			<DialogContent className={classes.dialogContent}>
				<IconTextField
					autoFocus
					fullWidth
					label="Source"
					onChange={handleSourceChange}
					value={source}
					Icon={Input}
				/>
				<IconTextField
					fullWidth
					label="SMS Target"
					onChange={handleTargetChange}
					value={target}
					Icon={Sms}
				/>
				<IconTextField
					fullWidth
					label="Phonetic Target"
					onChange={handlePhoneticChange}
					value={phonetic}
					Icon={Phone}
				/>
				<Divider className={classes.adornmentDivider} />
				<Typography variant="h5" className={classes.accordionSummaryText}>Reminder Template Overrides</Typography>
				<Typography>Select message templates to override the default appointment reminders for this procedure.</Typography>
				<div className={classes.templateContainer}>
					<div className={classes.templateSelector}>
						<Typography variant="h6">SMS Reminder Template</Typography>
						<FormControl className={classes.form} variant="outlined">
							<Select
								value={messageTemplates && smsReminder ? smsReminder || 'Default' : 'Default'}
								onChange={event => { setSmsReminder(event.target.value); }}
								inputProps={{ 'aria-label': 'Without label' }}>
								<MenuItem value="Default" key={JSON.stringify('Default')}>
                                    Default
								</MenuItem>
								{messageTemplates && messageTemplates.map(template => (
									<MenuItem value={template.name} key={JSON.stringify(template)}>
										{template.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<div className={classes.templateSelector}>
						<Typography variant="h6">Call Reminder Template</Typography>
						<FormControl className={classes.form} variant="outlined">
							<Select
								value={messageTemplates && phoneReminder ? phoneReminder || 'Default' : 'Default'}
								onChange={event => { setPhoneReminder(event.target.value); }}
								inputProps={{ 'aria-label': 'Without label' }}>
								<MenuItem value="Default" key={JSON.stringify('Default')}>
                                    Default
								</MenuItem>
								{messageTemplates && messageTemplates.map(template => (
									<MenuItem value={template.name} key={JSON.stringify(template)}>
										{template.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color="primary">Cancel</Button>
				<Button
					disabled={isSaveDisabled}
					endIcon={<Save />}
					onClick={handleSave}
					color="primary"
					variant={isSaveDisabled ? 'outlined' : 'contained'}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

ProcedureMappingModal.propTypes = {
	onCancel: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	open: PropTypes.bool,
	messageTemplates: PropTypes.arrayOf(PropTypes.instanceOf(Template)),
	procedure: PropTypes.instanceOf(Procedure),
	procedures: PropTypes.arrayOf(PropTypes.instanceOf(Procedure))
};

export default ProcedureMappingModal;
