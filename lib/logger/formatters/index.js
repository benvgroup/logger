/* eslint no-param-reassign: off */
import { format } from 'winston';

function isObject(obj) {
  return obj
    && typeof obj === 'object'
    && !Array.isArray(obj)
    && Object.keys(obj).length > 0;
}

/**
 * Stores a given set of key/value items on info.labels
 */
exports.labels = format((info, opts) => {
  if (!isObject(opts)) return info;

  info.labels = {};

  Object
    .keys(opts)
    .forEach((key) => { info.labels[key] = opts[key].toString(); });

  return info;
});

/**
 * Stores a given prefix on info.prefix
 */
exports.prefix = format((info, opts) => {
  if (!opts) return info;
  info.prefix = opts.toString();
  return info;
});
