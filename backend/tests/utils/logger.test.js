/**
 * Logger Tests
 */

const { createLogger } = require('../../src/utils/logger');

describe('Logger', () => {
  test('should create logger instance', () => {
    const logger = createLogger('TEST');
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  test('should log without errors', () => {
    const logger = createLogger('TEST');
    expect(() => {
      logger.info('Test message');
      logger.error('Test error');
      logger.warn('Test warning');
      logger.debug('Test debug');
    }).not.toThrow();
  });
});

