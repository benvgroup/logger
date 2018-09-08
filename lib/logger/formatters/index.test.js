import * as formatters from '.';

const labels = (opts, info = {}) => formatters.labels().transform(info, opts);
const prefix = (opts, info = {}) => formatters.prefix().transform(info, opts);

describe('labels', () => {
  test('store a given object', () => {
    expect(labels({ a: 1 })).toEqual({ labels: { a: '1' } });
  });

  test('store only objects with values', () => {
    expect(labels()).toEqual({});
    expect(labels(null)).toEqual({});
    expect(labels({})).toEqual({});
    expect(labels(1)).toEqual({});
    expect(labels('a')).toEqual({});
    expect(labels([1, 2, 3])).toEqual({});
    expect(labels(true)).toEqual({});
  });
});

describe('prefix', () => {
  test('store a given prefix as a string', () => {
    expect(prefix()).toEqual({});
    expect(prefix(1)).toEqual({ prefix: '1' });
    expect(prefix(true)).toEqual({ prefix: 'true' });
    expect(prefix([1, 2, 3])).toEqual({ prefix: '1,2,3' });
    expect(prefix({ a: 1 })).toEqual({ prefix: '[object Object]' });
  });
});
