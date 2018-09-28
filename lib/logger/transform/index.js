/* eslint no-param-reassign: off */
import { format } from 'winston';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';

/**
 * The LEVEL symbol
 */
exports.LEVEL = LEVEL;

/**
 * The MESSAGE symbol
 */
exports.MESSAGE = MESSAGE;

/**
 * The SPLAT symbol
 */
exports.SPLAT = SPLAT;

/**
 * Looks for an exception on info or at the splat attribute
 * on info and fills an exception attribute on it.
 * @param {*} info
 * @returns {Object} the modified info object
 */
function exception(info) {
  if (info.message && info.stack) {
    info.exception = { message: info.message, stack: info.stack };
  } else if (info[SPLAT] && info[SPLAT].length > 0 && info[SPLAT][0].stack) {
    info.exception = {
      message: info[SPLAT][0].message,
      stack: info[SPLAT][0].stack,
    };
  }
  return info;
}

exports.exception = format(exception);

/**
 * Adds all labels given on opts into info, merging them with
 * anyones already passed on splat.
 * @param {*} info
 * @param {*} opts
 * @returns {Object} the modified info object
 */
function labels(info, opts) {
  const values = [];
  if (opts && opts.labels) values.push(opts.labels);
  if (info[SPLAT] && info[SPLAT].labels) values.push(info[SPLAT].labels);
  if (values.length) info.labels = Object.assign(...values);
  return info;
}

exports.labels = format(labels);

/**
 * Adds the prefix given on opts into info
 * @param {*} info
 * @param {*} opts
 * @returns {Object} the modified info object
 */
function prefix(info, opts) {
  if (opts && opts.prefix) info.prefix = opts.prefix;
  return info;
}

exports.prefix = format(prefix);
