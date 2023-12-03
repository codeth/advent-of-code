/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  cache: false,
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.ts$': '$1',
  },
  verbose: process.env.TEST_DEBUG === '1',
  silent: process.env.TEST_DEBUG !== '1',
};