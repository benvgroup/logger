const { createLogger } = require('./dist/lib/logger');

const logger = createLogger({ level: 'debug', labels: { app: 'some-app' }, prefix: 'dummy' });

// EMERGENCY
logger.emergency('we got a situation here');
logger.emergency('we got a situation here', 'extra info =>', 1, 2, ['first', 'second']);
logger.emergency(new Error('we got a situation here'));
// ALERT
logger.alert('we got a situation here');
logger.alert('we got a situation here', 'extra info =>', 1, 2, ['first', 'second']);
logger.alert(new Error('we got a situation here'));
// CRITICAL
logger.critical('we got a situation here');
logger.critical('we got a situation here', 'extra info =>', 1, 2, ['first', 'second']);
logger.critical(new Error('we got a situation here'));
// ERROR
logger.error('we got a situation here');
logger.error('we got a situation here', 'extra info =>', 1, 2, ['first', 'second']);
logger.error(new Error('we got a situation here'));
logger.error('personalized error message', 1, 2, new Error('Some error'), { a: 10 }, new Error('Some other error'), false);
// WARNING
logger.warning('we got a situation here');
logger.warning('we got a situation here', 'extra info =>', 1, 2, ['first', 'second']);
// NOTICE
logger.notice('we got a situation here');
logger.notice('we got a situation here', 'extra info =>', 1, 2, ['first', 'second']);
// INFO
logger.info('we got a situation here');
logger.info('we got a situation here', 'extra info =>', 1, 2, ['first', 'second']);
// DEBUG
logger.debug('we got a situation here');
logger.debug('we got a situation here', 'extra info =>', 1, 2, ['first', 'second']);
logger.debug({ c: 4 }, 1, 2, { a: 10 }, false);
