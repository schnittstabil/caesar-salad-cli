import fs from 'fs';
import path from 'path';

import caesarSalad from 'caesar-salad';
import test from 'ava';
import pify from 'pify';

import execCli from './helpers/exec-cli';

const fsP = pify(fs);

const cryptTest = (t, task) => {
	t.plan(2);

	return Promise.all([
		execCli(task),
		fsP.readFile(task.expected)
	]).then(([result, expected]) => {
		t.truthy(result.output);
		t.is(result.output.toString(), expected.toString());
	});
};

[
	{
		title: 'caesar',
		input: '/fixtures/0..127.dat',
		password: 'b',
		cipher: 'caesar',
		output: true,
		expected: '/fixtures/0..127.dat.caesar.b'
	},
	{
		title: 'rot13',
		input: '/fixtures/0..127.dat',
		cipher: 'rot13',
		output: true,
		expected: '/fixtures/0..127.dat.rot13'
	},
	{
		title: 'rot18',
		input: '/fixtures/0..127.dat',
		cipher: 'rot18',
		output: true,
		expected: '/fixtures/0..127.dat.rot18'
	},
	{
		title: 'rot47',
		input: '/fixtures/0..127.dat',
		cipher: 'rot47',
		output: true,
		expected: '/fixtures/0..127.dat.rot47'
	},
	{
		title: 'rot5',
		input: '/fixtures/0..127.dat',
		cipher: 'rot5',
		output: true,
		expected: '/fixtures/0..127.dat.rot5'
	},
	{
		title: 'vigenere',
		input: '/fixtures/0..127.dat',
		password: 'abc',
		cipher: 'vigenere',
		output: true,
		expected: '/fixtures/0..127.dat.vigenere.abc'
	}
].map(
	task => Object.assign({}, task, {
		input: path.join(__dirname, task.input),
		expected: path.join(__dirname, task.expected)
	})
).forEach(function (task) {
	test(task.title + ' should be encrypted correctly', cryptTest, Object.assign({}, task, {
		command: 'enc'
	}));
	test(task.title + ' should be decrypted correctly', cryptTest, Object.assign({}, task, {
		command: 'dec',
		input: task.expected,
		expected: task.input
	}));
});

test('show help on missing command', t => {
	t.plan(2);

	return execCli().catch(err => {
		var output = err.stdout + err.stderr;

		t.is(err.code, 1);
		t.regex(output, /usage/i);
	});
});

test('show help on unknown command', t => {
	t.plan(3);

	return execCli({command: 'UNKNWON_CMD'}).catch(err => {
		var output = err.stdout + err.stderr;

		t.is(err.code, 1);
		t.regex(output, /usage/i);
		t.regex(output, /UNKNWON_CMD/i);
	});
});

test('error on encrypt with unknown cipher', t => {
	t.plan(2);

	return execCli({command: 'enc', cipher: 'UNKNWON_CIPHER'}).catch(err => {
		var output = err.stdout + err.stderr;

		t.is(err.code, 1);
		t.regex(output, /UNKNWON_CIPHER/i);
	});
});

test('error on decrypt with unknown cipher', t => {
	t.plan(2);

	return execCli({command: 'dec', cipher: 'UNKNWON_CIPHER'}).catch(err => {
		var output = err.stdout + err.stderr;

		t.is(err.code, 1);
		t.regex(output, /UNKNWON_CIPHER/i);
	});
});

test('list ciphers', t => {
	t.plan(1);

	return execCli({command: 'list'}).then(result => {
		var expected = [].concat(caesarSalad.ciphers).map(c => c.toLowerCase()).sort();
		var parsed = result.stdout.trim().split(/\s/g).map(c => c.toLowerCase()).sort();

		t.deepEqual(parsed, expected);
	});
});
