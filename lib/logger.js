import winston from 'winston';

/**
 * Setup to expose.
 * @type {Object}
 */
const logger = exports;

/**
 * Expose version.
 * @type {string}
 */
logger.version = require('../package.json').version;

/**
 * Expose winston itself.
 * @type {Object}
 */
logger.winston = winston;

/**
 * Expose our configuration.
 * @type {Object}
 */
logger.config = require('./logger/configs');

/**
 * Expose core Logging-related prototypes.
 * @type {function}
 */
logger.createLogger = require('./logger/create-logger');

/**
 * Expose our transform methods.
 * @type {Object}
 */
logger.transform = require('./logger/transform');

/**
 * Expose our formatting methods.
 * @type {Object}
 */
logger.format = require('./logger/format');
