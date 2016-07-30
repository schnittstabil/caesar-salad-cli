'use strict';
const caesarSalad = require('caesar-salad');

function getCipher(name) {
	const lowerName = name.toLowerCase();
	const cipherName = caesarSalad.ciphers.reduce(function (prev, curr) {
		return curr.toLowerCase() === lowerName ? curr : prev;
	}, null);

	return caesarSalad[cipherName];
}

module.exports = getCipher;
