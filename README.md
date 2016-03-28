# TSFP

A collection of functional utility libraries for TS/JS projects!

## Installation

To install the latest version:

```bash
$ npm install --save-dev tsfp
```

Most likely you'll also need [the Immutable.js](https://github.com/facebook/immutable-js) library.

```bash
$ npm install --save-dev immutable
```

## Documentation

[Read the docs](http://tsfp.js.org) and taste the FP candies!

## Contributing

If you'd like to contribute to TSFP, you'll need to run the following commands to get your environment set up:

```bash
$ git clone https://github.com/zhenwenc/tsfp.git
$ cd tsfp                   # go to the tsfp directory
$ npm install               # install local npm build / test dependencies

# Available scripts:

$ npm run typings-install   # install external type definitions
$ npm run build             # compile typescript source code
$ npm run test              # run all unit test suits
$ npm run watch:test        # watch for source / test file changes
$ npm run docs              # generate documentation files
```

`npm run watch:test` will watch for changes in the `/src/` and `/test/` directory, compile the
source files when a change occurs. The output files are written to the `/dist/` directory. It will also re-run the unit tests every time you update any source files.


## License

`TSFP` is [MIT-licensed](./LICENSE).
