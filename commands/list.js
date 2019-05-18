'use strict';
const caesarSalad = require('caesar-salad');

const list = (cli, cb) => {
	caesarSalad.ciphers.forEach(name => {
		console.log(name);
	});

	return cb(0);
};

module.exports = list;
