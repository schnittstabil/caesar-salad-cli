'use strict';
var caesarSalad = require('caesar-salad');

function list(cli, cb) {
	caesarSalad.ciphers.forEach(function (name) {
		console.log(name);
	});

	return cb(0);
}

module.exports = list;
