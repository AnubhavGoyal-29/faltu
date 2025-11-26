#!/usr/bin/env node
/**
 * Redis Configuration and Connectivity Check
 * 
 * Usage: node check-redis.js
 * 
 * Checks:
 * 1. Redis package installation
 * 2. Environment configuration
 * 3. Connection attempt
 * 4. Basic operations
 */

const path = require('path');
const Module = require('module');

// Add backend/node_modules to module path for ioredis
const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
const originalResolve = Module._resolveFilename;

Module._resolveFilename = function(...args) {
  try {
    return originalResolve.apply(this, args);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      const request = args[0];
      if (request === 'ioredis') {
        const ioredisPath = path.join(backendNodeModules, 'ioredis');
        return require.resolve(ioredisPath);
      }
    }
    throw e;
  }
};

console.log('🔍 Checking Redis Configuration and Connectivity...\n');
console.log('='.repeat(60));

// Check 1: Package installation
console.log('\n1️⃣  Checking Redis package installation...');
try {
  const pkg = require('./backend/package.json');
  const redisVersion = pkg.dependencies.ioredis || pkg.devDependencies?.ioredis;
  if (redisVersion) {
    console.log('✅ ioredis package is listed in package.json');
    console.log(`   Version: ${redisVersion}`);
  } else {
    console.log('❌ ioredis not found in package.json');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Could not read package.json');
  console.log('   Error:', error.message);
  process.exit(1);
}

// Check 2: Environment variables
console.log('\n2️⃣  Checking environment configuration...');
const envVars = {
  REDIS_ENABLED: process.env.REDIS_ENABLED,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD ? '***set***' : undefined,
  REDIS_DB: process.env.REDIS_DB
};

console.log('   Environment variables:');
Object.entries(envVars).forEach(([key, value]) => {
  const display = value !== undefined ? value : '(using default)';
  const status = value !== undefined ? '✅' : '⚪';
  console.log(`   ${status} ${key}: ${display}`);
});

// Determine connection settings
const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD || null;
const redisDb = parseInt(process.env.REDIS_DB || '0', 10);
const redisEnabled = process.env.REDIS_ENABLED !== 'false';

console.log(`\n   Connection will use:`);
if (redisUrl) {
  console.log(`   - URL: ${redisUrl.replace(/:[^:@]+@/, ':***@')}`);
} else {
  console.log(`   - Host: ${redisHost}`);
  console.log(`   - Port: ${redisPort}`);
  console.log(`   - Database: ${redisDb}`);
  console.log(`   - Password: ${redisPassword ? '***set***' : 'none'}`);
}
console.log(`   - Enabled: ${redisEnabled ? 'Yes' : 'No'}`);

// Check 3: Test connection
console.log('\n3️⃣  Testing Redis connection...');
if (!redisEnabled) {
  console.log('⚠️  Redis is disabled (REDIS_ENABLED=false)');
  console.log('   The application will work without Redis, but caching will be disabled.');
  process.exit(0);
}

async function testConnection() {
  const Redis = require('ioredis');
  let client = null;
  
  try {
    // Create client
    if (redisUrl) {
      client = new Redis(redisUrl, {
        retryStrategy: () => null,
        maxRetriesPerRequest: 1,
        enableReadyCheck: true,
        lazyConnect: true,
        connectTimeout: 3000
      });
    } else {
      client = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        db: redisDb,
        retryStrategy: () => null,
        maxRetriesPerRequest: 1,
        enableReadyCheck: true,
        lazyConnect: true,
        connectTimeout: 3000
      });
    }

    // Set timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 3 seconds')), 3000);
    });

    // Attempt connection
    const connectPromise = client.connect();
    await Promise.race([connectPromise, timeoutPromise]);
    
    console.log('✅ Successfully connected to Redis!');
    
    // Test PING
    const pingResult = await client.ping();
    console.log(`   PING response: ${pingResult}`);
    
    // Test SET/GET
    console.log('\n4️⃣  Testing basic operations...');
    const testKey = 'test:connection:check';
    const testValue = `test-${Date.now()}`;
    
    await client.set(testKey, testValue, 'EX', 10);
    console.log('✅ SET operation successful');
    
    const retrieved = await client.get(testKey);
    if (retrieved === testValue) {
      console.log('✅ GET operation successful');
      console.log(`   Retrieved value: "${retrieved}"`);
    } else {
      console.log('❌ GET operation failed - value mismatch');
    }
    
    // Test DEL
    await client.del(testKey);
    console.log('✅ DEL operation successful');
    
    // Get server info
    const info = await client.info('server');
    const versionMatch = info.match(/redis_version:([\d.]+)/);
    if (versionMatch) {
      console.log(`\n📊 Redis Server Info:`);
      console.log(`   Version: ${versionMatch[1]}`);
    }
    
    await client.quit();
    console.log('\n✅ All tests passed! Redis is working correctly.');
    console.log('\n💡 Your project is correctly configured to use Redis.');
    
  } catch (error) {
    console.log('❌ Failed to connect to Redis');
    console.log(`   Error: ${error.message}`);
    console.log('\n📋 Troubleshooting steps:');
    console.log('   1. Check if Redis server is installed:');
    console.log('      brew install redis');
    console.log('   2. Start Redis server:');
    console.log('      brew services start redis');
    console.log('      OR');
    console.log('      redis-server');
    console.log('   3. Verify Redis is running:');
    console.log('      redis-cli ping');
    console.log('   4. Check connection settings:');
    console.log(`      Host: ${redisHost}, Port: ${redisPort}`);
    console.log('\n⚠️  Note: Your application will work without Redis');
    console.log('      (it has graceful fallbacks), but caching will be disabled.');
    
    if (client) {
      try {
        await client.quit();
      } catch (e) {
        // Ignore
      }
    }
    process.exit(1);
  }
}

// Run test
testConnection().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

