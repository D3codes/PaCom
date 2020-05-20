module.exports = (number) => {
	if (!number) return null;
	const strippedNumber = number.replace(/\D/g, '');
	if (strippedNumber.length === 10) return `+1${strippedNumber}`;
	if (strippedNumber.length === 11 && strippedNumber[0] === '1') return `+${strippedNumber}`;
	return null;
};
