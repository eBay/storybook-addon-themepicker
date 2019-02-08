'use strict';

process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';
process.env.ENV = 'unittest';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const jestModule = require('jest');
const argv = process.argv.slice(2);

// Watch unless on CI or in coverage mode
if (!process.env.CI && argv.indexOf('--coverage') < 0) {
  argv.push('--watch');
}

// In CI mode, always run with coverage
if (process.env.CI) {
  argv.push('--coverage');
}

jestModule.run(argv);
