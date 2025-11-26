/**
 * Jest Test Setup
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.REDIS_ENABLED = 'false'; // Disable Redis for tests unless explicitly enabled

// Increase timeout for integration tests
jest.setTimeout(30000);

