'use strict';
const stream = require('stream');
const fs = require('fs');
const os = require('os');

const cliCryptAction = (Cipher, text, opts, done) => {
	const input = opts.input ? fs.createReadStream(opts.input, {encoding: 'utf8'}) : process.stdin;
	const output = opts.output ? fs.createWriteStream(opts.output, {encoding: 'utf8'}) : process.stdout;
	const cipher = new Cipher(opts.password);
	const cipherStream = new stream.Transform();

	if (Array.isArray(text)) {
		text = text.join(' ');
	}

	cipherStream._transform = function (chunk, enc, cb) {
		this.push(cipher.crypt(chunk.toString()));
		cb();
	};

	cipherStream.on('end', () => {
		done(0);
	});

	cipherStream.on('error', () => {
		done(1);
	});

	if (input.isTTY) {
		if (text) {
			cipherStream.end(text + os.EOL);
		}
	} else {
		input.on('end', () => {
			cipherStream.end(text);
		});
		input.pipe(cipherStream, {end: false});

		if (typeof input.end === 'function') {
			input.end();
		}
	}

	cipherStream.pipe(output);
};

module.exports = cliCryptAction;
