module.exports = (number) => {
	const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	const found = number.match(regex);
	return found ? found[0] : null;
};
