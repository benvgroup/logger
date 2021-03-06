import * as fn from './index';

fn.colors.enabled = false;

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

describe('processExceptionsAndSplats', () => {
  test('returns an empty array', () => {
    expect(fn.processExceptionsAndSplats()).toBeUndefined();
    expect(fn.processExceptionsAndSplats({})).toBeUndefined();
    expect(fn.processExceptionsAndSplats({ [fn.SPLAT]: [] })).toBeUndefined();
    expect(fn.processExceptionsAndSplats({ [fn.SPLAT]: 'anything but an array' })).toBeUndefined();
  });

  test('populates exception passed as message', () => {
    const { splat, exceptions } = fn.processExceptionsAndSplats({
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
    const invocation = { count: 0 };
    const { splat, exceptions } = fn.processExceptionsAndSplats(
      {
        [fn.SPLAT]: [
          10,
          { a: 20 },
          false,
        ],
      },
      (res) => {
        invocation.count += 1;
        invocation.splat = res.splat;
        invocation.exceptions = res.exceptions;
      },
    );

    expect(splat).toEqual([
      10,
      { a: 20 },
      false,
    ]);
    expect(exceptions).toEqual([]);

    expect(invocation.count).toBe(1);
    expect(invocation.splat).toBe(splat);
    expect(invocation.exceptions).toBe(exceptions);
  });

  test('populates only exceptions', () => {
    const invocation = { count: 0 };
    const { splat, exceptions } = fn.processExceptionsAndSplats(
      {
        [fn.SPLAT]: [
          { message: 'First exception', stack: 'Error: First exception stack' },
          { message: 'Second exception', stack: 'Error: Second exception stack' },
        ],
      },
      (res) => {
        invocation.count += 1;
        invocation.splat = res.splat;
        invocation.exceptions = res.exceptions;
      },
    );

    expect(splat).toEqual([
      '#0: Error: First exception',
      '#1: Error: Second exception',
    ]);
    expect(exceptions).toEqual([
      '#0: Error: First exception stack',
      '#1: Error: Second exception stack',
    ]);

    expect(invocation.count).toBe(1);
    expect(invocation.splat).toBe(splat);
    expect(invocation.exceptions).toBe(exceptions);
  });

  test('populates a new splat and exceptions with the exceptions within', () => {
    const { splat, exceptions } = fn.processExceptionsAndSplats({
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

  test('does not invoke callback', () => {
    const invocation = { count: 0 };
    fn.processExceptionsAndSplats({}, () => { invocation.count = 1; });
    expect(invocation.count).toBe(0);
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

  test('returns undef for an invalid level', () => {
    expect(fn.level({ level: 'idontexist' })).toBe('[IDONTEXIST]');
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

describe('console', () => {
  test('logging simple message', () => {
    const opts = {};
    const info = {
      timestamp: '2018-09-26T10:11:12.987Z',
      level: 'notice',
      message: 'hey, notice this!',
      ms: '10ms',
    };
    fn.console().transform(info, opts);

    expect(info[fn.MESSAGE])
      .toEqual('10:11:12.987Z   10ms [NOTICE   ] hey, notice this!');
  });

  test('logging message with splat', () => {
    const opts = {};
    const info = {
      timestamp: '2018-09-26T10:11:12.987Z',
      level: 'log',
      message: 'we got company',
      ms: '10ms',
      [fn.SPLAT]: [{ a: 10, b: true, c: () => { } }],
    };
    fn.console().transform(info, opts);

    expect(info[fn.MESSAGE])
      .toEqual('10:11:12.987Z   10ms [LOG      ] we got company [{"a":10,"b":true}]');
  });

  test('logging exception with splat', () => {
    const opts = {};
    const info = new Error('something is not right');
    info.timestamp = '2018-09-26T10:11:12.987Z';
    info.level = 'error';
    info.ms = '10ms';
    info[fn.SPLAT] = [{ a: 10, b: true, c: () => { } }];

    fn.console().transform(info, opts);

    expect(info[fn.MESSAGE])
    // eslint-disable-next-line no-regex-spaces
      .toMatch(/10:11:12.987Z   10ms \[ERROR    \] something is not right \[\{"a":10,"b":true\}\] \n    #0: Error: something is not right\n        at Object/);
  });

  test('logging exception without custom message', () => {
    const opts = {};
    const info = new Error('something is not right');
    info.timestamp = '2018-09-26T10:11:12.987Z';
    info.level = 'error';
    info.ms = '10ms';

    fn.console().transform(info, opts);

    expect(info[fn.MESSAGE])
    // eslint-disable-next-line no-regex-spaces
      .toMatch(/10:11:12.987Z   10ms \[ERROR    \] something is not right \n    #0: Error: something is not right\n        at Object/);
  });

  test('logging exception with custom message ', () => {
    const opts = {};
    const info = {
      timestamp: '2018-09-26T10:11:12.987Z',
      level: 'error',
      message: 'kabum!',
      ms: '10ms',
      [fn.SPLAT]: [new Error('exception in splat')],
    };

    fn.console().transform(info, opts);

    expect(info[fn.MESSAGE])
    // eslint-disable-next-line no-regex-spaces
      .toMatch(/10:11:12.987Z   10ms \[ERROR    \] kabum! \["#0: Error: exception in splat"\] \n    #0: Error: exception in splat\n        at Object/);
  });
});
