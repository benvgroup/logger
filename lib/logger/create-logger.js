import winston from 'winston';

import config from './configs';
import transform from './transform';

/**
 * Create a new instance of a benv Logger. Creates a new
 * prototype for each instance.
 * @param {!Object} options - Options for the created logger.
 * @returns {Logger} - A newly created logger instance.
 */
module.exports = (options = {}) => {
  const { levels } = config.benv;

  const opts = {
    level: options.level || 'debug',
    format: winston.format.combine(
      transform.labels(options.labels),
      transform.prefix(options.prefix),
      transform.exception(),
      winston.format.timestamp(),
      winston.format.ms(),
      winston.format.prettyPrint(),
    ),
    transports: [
      new winston.transports.Console(),
    ],
    levels,
  };

  return winston.createLogger(opts);
};
