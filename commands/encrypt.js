'use strict';
const getCipher = require('../get-cipher');
const cliCryptAction = require('../cli-crypt-action');

const encrypt = (cli, cb) => {
	const cipherName = cli.flags.cipher;
	const cipher = getCipher(cipherName);

	if (!cipher) {
		console.error('Unknown cipher `' + cipherName + '`');
		return cb(1);
	}

	cliCryptAction(cipher.Cipher, cli.input, cli.flags, cb);
};

module.exports = encrypt;
