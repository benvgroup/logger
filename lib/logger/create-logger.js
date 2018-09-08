import winston from 'winston';

import * as config from './configs';
import format from './formatters';

/**
 * Create a new instance of a benv Logger. Creates a new
 * prototype for each instance.
 * @param {!Object} options - Options for the created logger.
 * @returns {Logger} - A newly created logger instance.
 */
module.exports = (options = {}) => {
  const { colors, levels } = config.benv;

  const opts = {
    level: options.level || 'debug',
    format: winston.format.combine(
      format.labels(options.labels),
      format.prefix(options.prefix),
      winston.format.timestamp(),
      winston.format.ms(),
      winston.format.colorize({ colors }),
      winston.format.simple(),
    ),
    transports: [
      new winston.transports.Console(),
    ],
    levels,
  };

  return winston.createLogger(opts);
};
