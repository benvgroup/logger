import { benv } from './index';

test('checking out predefined levels', () => {
  expect(benv.levels).toEqual({
    emergency: 0,
    alert: 1,
    critical: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  });
});

test('checking out our predefined colors', () => {
  expect(benv.colors).toEqual({
    emergency: 'redBG bold white',
    alert: 'redBG white',
    critical: 'bold red',
    error: 'red',
    warning: 'yellow',
    notice: 'green',
    info: 'gray',
    debug: 'dim gray',
  });
});
