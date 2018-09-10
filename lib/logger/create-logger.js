import winston from 'winston';

import config from './configs';
import format from './format';
import transform from './transform';

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
      winston.format.timestamp(),
      winston.format.ms(),
      transform.labels(options.labels),
      transform.prefix(options.prefix),
      transform.exception(),
      format.development.console({ colors }),
    ),
    transports: [
      new winston.transports.Console(),
    ],
    levels,
  };

  return winston.createLogger(opts);
};
