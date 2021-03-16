import React, {
	useState, Fragment, useEffect
} from 'react';
import PropTypes from 'prop-types';
import {
	Typography, Select, FormControl, MenuItem, TextField
} from '@material-ui/core';
import {
	Warning, Block, EventBusy
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import DescriptiveIconButton from '../descriptiveIconButton';

const useStyles = makeStyles(theme => ({
	dateVerificationOptions: {
		marginBottom: theme.spacing()
	},
	dayInputField: {
		width: 30
	}
}));

export default function DateVerification({ dateVerification, setDateVerification, hasWritePermission = false }) {
	const classes = useStyles();
	const [numberOfDays, setNumberOfDays] = useState(dateVerification.numberOfDays);
	const [endOfRange, setEndOfRange] = useState(dateVerification.endOfRange);
	const [allowSendOutsideRange, setAllowSendOutsideRange] = useState(dateVerification.allowSendOutsideRange);
	const [shouldUseBusinessDays, setShouldUseBusinessDays] = useState(dateVerification.useBusinessDays);

	useEffect(() => {
		const newDateVerification = {
			numberOfDays,
			endOfRange,
			allowSendOutsideRange,
			useBusinessDays: shouldUseBusinessDays
		};
		setDateVerification(newDateVerification);
	}, [numberOfDays, endOfRange, allowSendOutsideRange, shouldUseBusinessDays]);

	return (
		<Fragment>
			<div className={classes.dateVerificationOptions}>
				<Typography variant="h5" display="inline">Reminders should be sent  </Typography>
				<FormControl>
					<Select
						value={!endOfRange}
						disabled={!hasWritePermission}
						onChange={event => { setEndOfRange(event.target.value ? null : numberOfDays + 1); }}
						inputProps={{ 'aria-label': 'Without label' }}>
						<MenuItem value>Exactly</MenuItem>
						<MenuItem value={false}>Between</MenuItem>
					</Select>
				</FormControl>
				<Typography variant="h5" display="inline">  </Typography>
				<TextField
					type="number"
					value={numberOfDays}
					disabled={!hasWritePermission}
					className={classes.dayInputField}
					onChange={event => { setNumberOfDays(parseInt(event.target.value, 10)); }}
					InputProps={{ inputProps: { min: 0 } }}
				/>
				{ endOfRange && (
					<Fragment>
						<Typography variant="h5" display="inline">  to  </Typography>
						<TextField
							type="number"
							value={endOfRange}
							disabled={!hasWritePermission}
							className={classes.dayInputField}
							onChange={event => { setEndOfRange(parseInt(event.target.value, 10)); }}
							InputProps={{ inputProps: { min: numberOfDays + 1 } }}
						/>
					</Fragment>
				)}
				<Typography variant="h5" display="inline">  </Typography>
				<FormControl>
					<Select
						value={shouldUseBusinessDays}
						disabled={!hasWritePermission}
						onChange={event => { setShouldUseBusinessDays(event.target.value); }}
						inputProps={{ 'aria-label': 'Without label' }}>
						<MenuItem value={false}>day(s)</MenuItem>
						<MenuItem value>business day(s)</MenuItem>
					</Select>
				</FormControl>
				<Typography variant="h5" display="inline">  before appointment.</Typography>
			</div>
			<div>
				<DescriptiveIconButton
					onClick={() => { setAllowSendOutsideRange(0); }}
					disabled={!hasWritePermission}
					selected={allowSendOutsideRange === 0}
					title="OFF"
					description="Do not verify the date before sending reminders."
					Icon={EventBusy}
				/>
				<DescriptiveIconButton
					onClick={() => { setAllowSendOutsideRange(1); }}
					disabled={!hasWritePermission}
					selected={allowSendOutsideRange === 1}
					title="WARNING"
					description="Show warning if reminders are sent outside of specified time."
					Icon={Warning}
				/>
				<DescriptiveIconButton
					onClick={() => { setAllowSendOutsideRange(2); }}
					disabled={!hasWritePermission}
					selected={allowSendOutsideRange === 2}
					title="BLOCK"
					description="Do not allow reminders to be sent outside of specified time."
					Icon={Block}
				/>
			</div>
		</Fragment>
	);
}

DateVerification.propTypes = {
	dateVerification: PropTypes.shape({
		numberOfDays: PropTypes.number,
		endOfRange: PropTypes.number,
		allowSendOutsideRange: PropTypes.number,
		useBusinessDays: PropTypes.bool
	}).isRequired,
	setDateVerification: PropTypes.func.isRequired,
	hasWritePermission: PropTypes.bool
};
