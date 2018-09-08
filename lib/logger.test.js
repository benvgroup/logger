import logger from './logger';

test('configuration is set', () => {
  expect(logger.config).toBeDefined();
});

test('version is the one declared on package.json', () => {
  // eslint-disable-next-line global-require
  const { version } = require('../package.json');
  expect(logger.version).toBe(version);
});

test('winston is exposed', () => {
  // eslint-disable-next-line global-require
  expect(logger.winston).toBe(require('winston'));
});
