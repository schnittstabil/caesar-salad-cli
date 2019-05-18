'use strict';
const caesarSalad = require('caesar-salad');

const getCipher = name => {
	const lowerName = name.toLowerCase();
	const cipherName = caesarSalad.ciphers.reduce(
		(prev, curr) => curr.toLowerCase() === lowerName ? curr : prev,
		null
	);

	return caesarSalad[cipherName];
};

module.exports = getCipher;
