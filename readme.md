# caesar-salad-cli [![Build Status](https://travis-ci.org/schnittstabil/caesar-salad-cli.svg?branch=master)](https://travis-ci.org/schnittstabil/caesar-salad-cli) [![Coverage Status](https://coveralls.io/repos/schnittstabil/caesar-salad-cli/badge.svg?branch=master&service=github)](https://coveralls.io/github/schnittstabil/caesar-salad-cli?branch=master) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

> Caesar, Vigenere and ROT Ciphers

## Install

```
$ npm install --global caesar-salad-cli
```

## Usage

```
$ caesar-salad

  Caesar, Vigenere and ROT Ciphers

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
```

```
$ caesar-salad list
Caesar
ROT5
ROT13
ROT18
ROT47
Vigenere
```

```
$ caesar-salad enc abcdef-0123456789@example.com
bcdefg-0123456789@fybnqmf.dpn

$ caesar-salad enc --cipher rot5 abcdef-0123456789@example.com
abcdef-5678901234@example.com
```

## Related

* [caesar-salad](https://github.com/schnittstabil/caesar-salad) API for this module

## License

MIT © [Michael Mayer](http://schnittstabil.de)
