/**
 * Cron Locks Tests
 */

const { acquireLock, releaseLock, isLocked, withLock, LOCK_KEYS } = require('../../src/cron/locks');

describe('Cron Locks', () => {
  test('should have lock keys defined', () => {
    expect(LOCK_KEYS.LUCKY_DRAW_HOURLY).toBeDefined();
    expect(LOCK_KEYS.LUCKY_DRAW_MINUTE).toBeDefined();
    expect(LOCK_KEYS.RUSH_RESET).toBeDefined();
  });

  test('acquireLock should return boolean', async () => {
    const result = await acquireLock('test:lock', 60);
    expect(typeof result).toBe('boolean');
  });

  test('isLocked should return boolean', async () => {
    const result = await isLocked('test:lock');
    expect(typeof result).toBe('boolean');
  });

  test('withLock should execute function when lock acquired', async () => {
    let executed = false;
    await withLock('test:withlock', async () => {
      executed = true;
      return 'result';
    }, 60);

    // If Redis unavailable, lock won't be acquired but function still executes
    // If Redis available, function executes
    expect(executed).toBe(true);
  });
});

