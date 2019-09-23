const fs = require('fs');
const path = require('path');

const pify = require('pify');
const execa = require('execa');
const tempfile = require('tempfile');

const fsP = pify(fs);

const _execCli = async task => {
	const args = [path.join(__dirname, '../../cli.js')];

	task = {...task};

	if (task.output === true) {
		task.output = tempfile('.dat');
	}

	if (task.cipher) {
		args.push('--cipher');
		args.push(task.cipher);
	}

	if (task.input) {
		args.push('--i');
		args.push(task.input);
	}

	if (task.output) {
		args.push('--o');
		args.push(task.output);
	}

	if (task.password) {
		args.push('--password');
		args.push(task.password);
	}

	if (task.command) {
		args.push(task.command);
	}

	const result = await execa(process.argv[0], args, {stripEof: false});
	result.args = args;

	if (task.output) {
		result.output = await fsP.readFile(task.output);
	}

	return result;
};

module.exports = _execCli;
