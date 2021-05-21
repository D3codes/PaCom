import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, FormControl, Select, MenuItem, Divider, Typography, Slide
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
	dialogTitle: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.secondary.contrastText
	},
	dialogContent: {
		'& > * + *': {
			marginTop: theme.spacing(2)
		},
		marginTop: theme.spacing(2)
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
	const [smsReminder, setSmsReminder] = useState('Default');
	const [phoneReminder, setPhoneReminder] = useState('Default');
	const [sendToReminder, setSendToReminder] = useState(true);
	const [sendToCustom, setSendToCustom] = useState(true);

	useEffect(() => {
		if (open && procedure) {
			setSource(procedure.source);
			setTarget(procedure.target);
			setPhonetic(procedure.phonetic);
			setPhoneReminder(procedure.phoneReminder);
			setSmsReminder(procedure.smsReminder);
			setSendToReminder(procedure.sendToReminder);
			setSendToCustom(procedure.sendToCustom);
		}
	}, [open, procedure]);

	const applyInitialState = () => {
		setSource('');
		setTarget('');
		setPhonetic('');
		setSmsReminder('Default');
		setPhoneReminder('Default');
	};

	const handleSourceChange = value => setSource(value);

	const handleTargetChange = value => setTarget(value);

	const handlePhoneticChange = value => setPhonetic(value);

	const handleCancel = () => {
		onCancel();
		applyInitialState();
	};

	const handleSave = () => {
		const existingProcedure = !procedure && procedures?.find(prov => prov.source === source);
		if (existingProcedure) {
			dialogController.confirmSave(ProcedureMappingSourceInUseTitle, ProcedureMappingSourceInUseMessage).then(({ response }) => {
				if (response === 0) {
					const newProcedureMapping = new Procedure(source, target, phonetic, phoneReminder, smsReminder, sendToReminder, sendToCustom);
					onSave(newProcedureMapping, procedure);
					applyInitialState();
				}
			});
		} else {
			const newProcedureMapping = new Procedure(source, target, phonetic, phoneReminder, smsReminder, sendToReminder, sendToCustom);
			onSave(newProcedureMapping, procedure);
			applyInitialState();
		}
	};

	const isSaveDisabled = !(source && target && phonetic);

	return (
		<Dialog fullWidth open={open} TransitionComponent={Slide} TransitionProps={{ direction: 'up' }}>
			<DialogTitle className={classes.dialogTitle}>{procedure ? 'Edit' : 'Add'} Procedure Mapping</DialogTitle>
			<DialogContent className={classes.dialogContent}>
				<Typography>Source must be configured exactly as it appears in the appointment list.</Typography>
				<IconTextField
					autoFocus
					fullWidth
					label="Source"
					onChange={handleSourceChange}
					value={source}
					Icon={Input}
					testId="source-field"
				/>
				<IconTextField
					fullWidth
					label="SMS Target"
					onChange={handleTargetChange}
					value={target}
					Icon={Sms}
					testId="sms-target-field"
				/>
				<IconTextField
					fullWidth
					label="Phonetic Target"
					onChange={handlePhoneticChange}
					value={phonetic}
					Icon={Phone}
					testId="phonetic-target-field"
				/>
				<Divider className={classes.adornmentDivider} />
				<Typography variant="h5" className={classes.accordionSummaryText}>Reminder Template Overrides</Typography>
				<Typography>Select message templates to send instead of the default appointment reminders for this procedure.</Typography>
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
