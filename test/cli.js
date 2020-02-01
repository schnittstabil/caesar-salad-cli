const fs = require('fs');
const path = require('path');

const caesarSalad = require('caesar-salad');
const test = require('ava');
const pify = require('pify');

const execCli = require('./helpers/_exec-cli');

const fsP = pify(fs);

const cryptTest = async (t, task) => {
	t.plan(2);

	const [result, expected] = await Promise.all([
		execCli(task),
		fsP.readFile(task.expected)
	]);

	t.truthy(result.output);
	t.is(result.output.toString(), expected.toString());
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
	task => ({
		...task,
		input: path.join(__dirname, task.input),
		expected: path.join(__dirname, task.expected)
	})
).forEach(task => {
	test(task.title + ' should be encrypted correctly', cryptTest, {
		...task,
		command: 'enc'
	});

	test(task.title + ' should be decrypted correctly', cryptTest, {
		...task,
		command: 'dec',
		input: task.expected,
		expected: task.input
	});
});

test('show help on missing command', async t => {
	const err = await t.throwsAsync(execCli);
	const output = err.stdout + err.stderr;

	t.is(err.exitCode, 1);
	t.regex(output, /usage/i);
});

test('show help on unknown command', async t => {
	const err = await t.throwsAsync(() => execCli({command: 'UNKNWON_CMD'}));
	const output = err.stdout + err.stderr;

	t.is(err.exitCode, 1);
	t.regex(output, /usage/i);
	t.regex(output, /UNKNWON_CMD/i);
});

test('error on encrypt with unknown cipher', async t => {
	const err = await t.throwsAsync(() => execCli({command: 'enc', cipher: 'UNKNWON_CIPHER'}));
	const output = err.stdout + err.stderr;

	t.is(err.exitCode, 1);
	t.regex(output, /UNKNWON_CIPHER/i);
});

test('error on decrypt with unknown cipher', async t => {
	const err = await t.throwsAsync(() => execCli({command: 'dec', cipher: 'UNKNWON_CIPHER'}));
	const output = err.stdout + err.stderr;

	t.is(err.exitCode, 1);
	t.regex(output, /UNKNWON_CIPHER/i);
});

test('list ciphers', async t => {
	const result = await execCli({command: 'list'});
	const expected = [].concat(caesarSalad.ciphers).map(c => c.toLowerCase()).sort();
	const parsed = result.stdout.trim().split(/\s/g).map(c => c.toLowerCase()).sort();

	t.deepEqual(parsed, expected);
});
