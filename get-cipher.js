'use strict';
var caesarSalad = require('caesar-salad');

function getCipher(name) {
	var lowerName = name.toLowerCase();
	var cipherName = caesarSalad.ciphers.reduce(function (prev, curr) {
		return curr.toLowerCase() === lowerName ? curr : prev;
	}, null);

	return caesarSalad[cipherName];
}

module.exports = getCipher;
