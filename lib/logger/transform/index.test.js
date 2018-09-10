import * as transform from './index';

const fn = {};

/**
 * Creates a wrapper for all methods in transform
 */
beforeAll(() => {
  Object.keys(transform)
    .forEach((key) => {
      fn[key] = (opts, info = {}) => {
        transform[key]().transform(info, opts);
        return info;
      };
    });
});

describe('exception', () => {
  test('with no exception present, creates nothing', () => {
    expect(fn.exception({})).not.toHaveProperty('exception');
  });

  test('gets from info if it is an exception', () => {
    const info = fn.exception({}, new Error('test error'));
    expect(info).toHaveProperty('exception');
    expect(info).toHaveProperty('message', 'test error');
    expect(info.exception).toHaveProperty('message', 'test error');
    expect(info.exception).toHaveProperty('stack');
  });

  test('if one is present at the first position of splat, use it', () => {
    const info = fn.exception({}, {
      message: 'original message',
      [transform.SPLAT]: [new Error('test error')],
    });
    expect(info).toHaveProperty('exception');
    expect(info).toHaveProperty('message', 'original message');
    expect(info.exception).toHaveProperty('message', 'test error');
    expect(info.exception).toHaveProperty('stack');
  });

  test('if an exception is on other position than first, ignore it', () => {
    const info = fn.exception({}, {
      message: 'original message',
      [transform.SPLAT]: ['some text', new Error('test error')],
    });
    expect(info).toHaveProperty('message', 'original message');
    expect(info).not.toHaveProperty('exception');
  });
});

describe('labels', () => {
  test('do nothing if no opts were given', () => {
    expect(fn.prefix()).not.toHaveProperty('labels');
  });

  test('assigns the given labels', () => {
    expect(fn.labels({ labels: { a: 1, b: 2 } }).labels)
      .toEqual({ a: 1, b: 2 });
  });

  test('when merging opts and info[SPLAT], info has precedence', () => {
    const info = { [transform.SPLAT]: { labels: { a: 20, c: 1 } } };
    const opts = { labels: { a: 1, b: 2 } };
    const result = { a: 20, b: 2, c: 1 };

    expect(fn.labels(opts, info).labels).toEqual(result);
  });
});

describe('prefix', () => {
  test('do nothing if no opts were given', () => {
    expect(fn.prefix()).not.toHaveProperty('prefix');
  });

  test('assigns the given prefix', () => {
    expect(fn.prefix({ prefix: 'assigned-prefix' }))
      .toHaveProperty('prefix', 'assigned-prefix');
  });
});
