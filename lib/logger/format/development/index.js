/* eslint no-param-reassign: off */
import { format } from 'winston';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import fastStringify from 'fast-safe-stringify';
import colors from 'colors/safe';
import config from '../../configs';

colors.setTheme(config.benv.colors);
colors.enabled = process.env.NODE_ENV !== 'production';

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
 * The colors component
 */
exports.colors = colors;

/**
 * Returns a formatted duration time
 * @param {?Object} info the given info object
 * @param {String} info.ms the duration
 * @returns {String} the formatted duration
 */
function duration(info) {
  if (!info || !info.ms) return '-ms';
  return colors.debug(info.ms.replace(/^[+|-]/, '').padStart(6));
}

exports.duration = duration;

/**
 * Returns an object with message and stack if the given
 * object is an exception, otherwise returns undefined.
 * @param {*} info a given info
 * @param {*} callback a callback to be invoked if it is an exception
 * @returns {undefined|Object}
 */
function exception(info, callback) {
  if (typeof info !== 'object') return undefined;
  if (!info.message || !info.stack) return undefined;
  if (callback) callback({ message: info.message, stack: info.stack });
  return { message: info.message, stack: info.stack };
}

exports.exception = exception;

/**
 * Returns an object containing all exceptions found on the
 * info itself plus all the ones found on splat
 * @param {*} info a given info
 * @param {*} callback a callback to be invoked if it is an exception
 * @returns {undefined|Object}
 */
function exceptions(info, callback) {
  if (!info) return undefined;

  // eslint-disable-next-line no-shadow
  const exceptions = [];
  const splat = [];
  let i = 0;

  // eslint-disable-next-line no-plusplus
  exception(info, err => exceptions.push(`#${i++}: ${err.stack}`));

  const infoSplat = [];
  if (info[SPLAT] && Array.isArray(info[SPLAT])) infoSplat.push(...info[SPLAT]);

  infoSplat.forEach((o) => {
    // eslint-disable-next-line no-unused-expressions
    exception(o, (err) => {
      splat.push(`#${i}: Error: ${err.message}`);
      exceptions.push(`#${i}: ${err.stack}`);
      i += 1;
    }) || splat.push(o);
  });

  const result = (exceptions.length === 0 && splat.length === 0)
    ? undefined
    : { splat, exceptions };

  if (result && callback) callback(result);

  return result;
}

exports.exceptions = exceptions;

/**
 * Ident a string, line by line
 * @param {string} text the given text
 * @param {number} [size=4] the amount to ident
 * @param {string} [char= ] the ident character
 * @returns {string}
 */
function ident(text, size = 4, char = ' ') {
  if (!text) return '';
  return (text || '').replace(/^(?!\s*$)/mg, char.repeat(size));
}

exports.ident = ident;

/**
 * Gets a formatted info string from a given info
 * @param {?Object} info given info package
 * @param {String} info.level the given level
 * @returns {String} the formatted info
 */
function level(info) {
  if (!info || !info.level) return '[UNDEFINED]';
  return colors[info.level](`[${info.level.toUpperCase().padEnd(9)}]`);
}

exports.level = level;

/**
 * Extracts the time portion from a given timestamp, or the
 * one for the current time if none was given
 * @param {?Object} info an object containing the timestamp attribute
 * @param {String} info.timestamp a timestamp on the ISO format
 * @returns {string} a time on the format hh:mm:ss.sssZ
 */
function time(info) {
  if (info && info.timestamp) return info.timestamp.replace(/^.*?T/, '');
  return colors.debug((new Date().toISOString()).replace(/^.*?T/, ''));
}

exports.time = time;

/**
 * Final generation for the output for our beloved developers
 */
exports.console = format((info) => {
  const parts = [];
  parts.push(time(info));
  parts.push(duration(info));
  parts.push(level(info));

  if (typeof info.message === 'string') parts.push(info.message);
  else parts.push(fastStringify(info.message));

  if (info[SPLAT]) {
    parts.push(` ${fastStringify(info[SPLAT])}`);
  }

  // exception
  if (info.exception) {
    parts.push(`\n${ident(info.exception.stack)}`);
  }

  info[MESSAGE] = parts.join(' ');

  return info;
});
