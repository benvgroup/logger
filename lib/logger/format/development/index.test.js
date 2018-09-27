import * as fn from './index';

describe('duration', () => {
  test('when no duration was given', () => {
    expect(fn.duration()).toBe('-ms');
  });

  test('when no duration was given', () => {
    expect(fn.duration({ ms: '+1000ms' })).toBe('1000ms');
    expect(fn.duration({ ms: '+1ms' })).toBe('   1ms');
  });
});

describe('exception', () => {
  test('return undefined for all non exception objects', () => {
    expect(fn.exception()).toBeUndefined();
    expect(fn.exception({})).toBeUndefined();
    expect(fn.exception(1)).toBeUndefined();
    expect(fn.exception('a')).toBeUndefined();
    expect(fn.exception(true)).toBeUndefined();
    expect(fn.exception({ message: 'message' })).toBeUndefined();
    expect(fn.exception({ stack: 'stack' })).toBeUndefined();
  });

  test('get all the relevant data from a given exception', () => {
    const result = fn.exception(new Error('teretete'));
    expect(result).toHaveProperty('message', 'teretete');
    expect(result).toHaveProperty('stack');
  });

  test('does not invoke callback when it isnt an exception', () => {
    let invocation = 0;
    fn.exception({}, () => { invocation = 1; });
    expect(invocation).toBe(0);
  });

  test('does invoke callback when it is an exception', () => {
    const invocation = { count: 0 };
    fn.exception(
      { message: 'msg', stack: 'stack' },
      (err) => {
        invocation.message = err.message;
        invocation.stack = err.stack;
        invocation.count = 1;
      },
    );

    expect(invocation.count).toBe(1);
    expect(invocation.message).toBe('msg');
    expect(invocation.stack).toBe('stack');
  });
});

describe('exceptions', () => {
  test('returns an empty array', () => {
    expect(fn.exceptions()).toBeUndefined();
    expect(fn.exceptions({})).toBeUndefined();
    expect(fn.exceptions({ [fn.SPLAT]: [] })).toBeUndefined();
    expect(fn.exceptions({ [fn.SPLAT]: 'anything but an array' })).toBeUndefined();
  });

  test('populates exception passed as message', () => {
    const { splat, exceptions } = fn.exceptions({
      message: 'The message is an exception',
      stack: 'Error: Exception as message stack',
      [fn.SPLAT]: [{ message: 'Exception', stack: 'Error: Exception stack' }],
    });

    expect(splat).toEqual([
      '#1: Error: Exception',
    ]);
    expect(exceptions).toEqual([
      '#0: Error: Exception as message stack',
      '#1: Error: Exception stack',
    ]);
  });

  test('populates only splats', () => {
    const { splat, exceptions } = fn.exceptions({
      [fn.SPLAT]: [
        10,
        { a: 20 },
        false,
      ],
    });

    expect(splat).toEqual([
      10,
      { a: 20 },
      false,
    ]);
    expect(exceptions).toEqual([]);
  });

  test('populates only exceptions', () => {
    const { splat, exceptions } = fn.exceptions({
      [fn.SPLAT]: [
        { message: 'First exception', stack: 'Error: First exception stack' },
        { message: 'Second exception', stack: 'Error: Second exception stack' },
      ],
    });

    expect(splat).toEqual([
      '#0: Error: First exception',
      '#1: Error: Second exception',
    ]);
    expect(exceptions).toEqual([
      '#0: Error: First exception stack',
      '#1: Error: Second exception stack',
    ]);
  });

  test('populates a new splat and exceptions with the exceptions within', () => {
    const { splat, exceptions } = fn.exceptions({
      [fn.SPLAT]: [
        10,
        { a: 20 },
        { message: 'First exception', stack: 'Error: First exception stack' },
        false,
        { message: 'Second exception', stack: 'Error: Second exception stack' },
      ],
    });

    expect(splat).toEqual([
      10,
      { a: 20 },
      '#0: Error: First exception',
      false,
      '#1: Error: Second exception',
    ]);
    expect(exceptions).toEqual([
      '#0: Error: First exception stack',
      '#1: Error: Second exception stack',
    ]);
});
});

describe('ident', () => {
  test('wont ident an empty string', () => {
    expect(fn.ident()).toBe('');
    expect(fn.ident('')).toBe('');
  });

  test('ident using the defaults', () => {
    expect(fn.ident('test')).toBe('    test');
  });

  test('ident using the given parameters', () => {
    expect(fn.ident('test', 3, '*')).toBe('***test');
  });
});

describe('level', () => {
  test('formats an info level from a given info', () => {
    expect(fn.level({ level: 'info' })).toBe('[INFO     ]');
  });

  test('returns undef for a level not given', () => {
    expect(fn.level()).toBe('[UNDEFINED]');
  });
});

describe('time', () => {
  test('extracts the time from a ISO time string on the timestamp attribute', () => {
    expect(fn.time({ timestamp: '2018-09-08T10:20:30.999Z' })).toBe('10:20:30.999Z');
  });

  test('uses the current time when no timestamp was given', () => {
    expect(fn.time()).toMatch(/^\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
