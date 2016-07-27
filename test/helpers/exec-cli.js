var fs = require('fs');
var path = require('path');

var pify = require('pify');
var execa = require('execa');
var tempfile = require('tempfile');

var fsP = pify(fs);

function execCli(task) {
	var args = [path.join(__dirname, '../../cli.js')];

	task = Object.assign({}, task);

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

	var child = execa(process.argv[0], args, {stripEof: false}).then(function (result) {
		result.args = args;

		return result;
	});

	if (task.output) {
		child = child.then(function (result) {
			return fsP.readFile(task.output).then(function (output) {
				result.output = output;

				return result;
			});
		});
	}

	return child;
}

module.exports = execCli;
