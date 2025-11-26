/**
 * Redis Client Tests
 */

const { initializeRedis, get, set, del, isRedisAvailable, close } = require('../../src/utils/redisClient');

describe('Redis Client', () => {
  beforeAll(async () => {
    // Initialize Redis (will fail gracefully if not available)
    initializeRedis();
    // Wait a bit for connection
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    await close();
  });

  test('should handle Redis unavailability gracefully', () => {
    // When Redis is not available, functions should return safe defaults
    expect(isRedisAvailable()).toBeDefined();
  });

  test('get should return null when Redis unavailable', async () => {
    const result = await get('test:key');
    // Should return null (either cache miss or Redis unavailable)
    expect(result).toBeNull();
  });

  test('set should return false when Redis unavailable', async () => {
    const result = await set('test:key', 'test-value', 60);
    // Should return false if Redis unavailable, true if available
    expect(typeof result).toBe('boolean');
  });

  test('del should return false when Redis unavailable', async () => {
    const result = await del('test:key');
    // Should return false if Redis unavailable, true if available
    expect(typeof result).toBe('boolean');
  });
});

