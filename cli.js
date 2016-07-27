#!/usr/bin/env node
'use strict';
var updateNotifier = require('update-notifier');
var meow = require('meow');

var cli = meow([
	'Usage: caesar-salad [options] [command]',
	'',
	'Commands',
	'  encrypt [options] [text]  encrypt [text], stdin or both',
	'  enc [options] [text]      (same as encrypt)',
	'  decrypt [options] [text]  decrypt [text], stdin or both',
	'  dec [options] [text]      (same as decrypt)',
	'  list [options]            list supported ciphers',
	'',
	'Options',
	'  -h, --help               output usage information',
	'  -V, --version            output the version number',
	'  -c, --cipher <string>    specify the cipher to use       [default: "Vigenere"]',
	'  -p, --password <string>  specify the password to use     [default: "b"]',
	'  -i, --input <path>       specify the input file to use',
	'  -o, --output <path>      specify the output file to use',
	'',
	'Examples',
	'  $ caesar-salad list',
	'  $ caesar-salad enc unicorn42',
	'  $ caesar-salad enc -c=vigenere -p=abc unicorn42',
	'  $ caesar-salad enc -c=rot5 unicorn42'
], {
	string: ['_'],
	boolean: [
		'version'
	],
	alias: {
		V: 'version',
		c: 'cipher',
		p: 'password',
		i: 'input',
		o: 'output'
	},
	default: {
		cipher: 'Vigenere',
		password: 'b'
	}
});

updateNotifier({pkg: cli.pkg}).notify();

var command = cli.input.shift();
var commandNames = {
	encrypt: 'encrypt',
	enc: 'encrypt',
	decrypt: 'decrypt',
	dec: 'decrypt',
	list: 'list'
};

if (!command) {
	cli.showHelp(1);
} else if (commandNames[command]) {
	var cliCommand = require('./commands/' + commandNames[command]);

	cliCommand(cli, function (exitCode) {
		process.exit(exitCode);
	});
} else {
	console.error('Unknown command `' + command + '`');
	cli.showHelp(1);
}
