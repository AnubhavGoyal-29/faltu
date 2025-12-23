import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;

export async function initRedis() {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
      },
      password: process.env.REDIS_PASSWORD || undefined
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (error) {
    console.error('❌ Redis connection error:', error.message);
    // Continue without Redis if connection fails
    console.warn('⚠️  Continuing without Redis cache');
  }
}

export function getRedis() {
  return redisClient;
}

