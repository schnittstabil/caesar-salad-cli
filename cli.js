#!/usr/bin/env node
'use strict';
const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const cli = meow(`
	Usage: caesar-salad [options] [command]

	Commands
	  encrypt [options] [text]  encrypt [text], stdin or both
	  enc [options] [text]      (same as encrypt)
	  decrypt [options] [text]  decrypt [text], stdin or both
	  dec [options] [text]      (same as decrypt)
	  list [options]            list supported ciphers

	Options
	  -h, --help               output usage information
	  -V, --version            output the version number
	  -c, --cipher <string>    specify the cipher to use       [default: "Vigenere"]
	  -p, --password <string>  specify the password to use     [default: "b"]
	  -i, --input <path>       specify the input file to use
	  -o, --output <path>      specify the output file to use

	Examples
	  $ caesar-salad list
	  $ caesar-salad enc unicorn42
	  $ caesar-salad enc -c=vigenere -p=abc unicorn42
	  $ caesar-salad enc -c=rot5 unicorn42
`, {
	flags: {
		version: {
			type: 'boolean',
			alias: 'V'
		},
		cipher: {
			type: 'string',
			alias: 'c',
			default: 'Vigenere'
		},
		password: {
			type: 'string',
			alias: 'p',
			default: 'b'
		},
		input: {
			type: 'string',
			alias: 'i'
		},
		output: {
			type: 'string',
			alias: 'o'
		}
	}
});

const command = cli.input.shift();
const commandNames = {
	encrypt: 'encrypt',
	enc: 'encrypt',
	decrypt: 'decrypt',
	dec: 'decrypt',
	list: 'list'
};

if (!command) {
	cli.showHelp(1);
} else if (commandNames[command]) {
	const cliCommand = require('./commands/' + commandNames[command]);

	cliCommand(cli, exitCode => {
		process.exit(exitCode);
	});
} else {
	console.error('Unknown command `' + command + '`');
	cli.showHelp(1);
}
