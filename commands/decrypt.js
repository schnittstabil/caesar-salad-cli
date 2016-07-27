'use strict';
var getCipher = require('../get-cipher');
var cliCryptAction = require('../cli-crypt-action');

function decrypt(cli, cb) {
	var cipherName = cli.flags.cipher;
	var cipher = getCipher(cipherName);

	if (!cipher) {
		console.error('Unknown cipher `' + cipherName + '`');
		return cb(1);
	}

	cliCryptAction(cipher.Decipher, cli.input, cli.flags, cb);
}

module.exports = decrypt;
