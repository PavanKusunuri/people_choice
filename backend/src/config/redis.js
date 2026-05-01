import Redis from 'ioredis';
import logger from '../utils/logger.js';

let redis = null;

export const initRedis = () => {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    redis.on('connect', () => {
      logger.info('Redis Connected');
    });

    redis.on('error', (err) => {
      logger.error(`Redis Error: ${err.message}`);
    });

    return redis;
  } catch (error) {
    logger.error(`Redis Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const getRedis = () => {
  if (!redis) {
    throw new Error('Redis not initialized. Call initRedis() first.');
  }
  return redis;
};

// Cache helper functions
export const cacheGet = async (key) => {
  const redis = getRedis();
  return redis.get(key);
};

export const cacheSet = async (key, value, ttl = 300) => {
  const redis = getRedis();
  if (ttl) {
    return redis.setex(key, ttl, JSON.stringify(value));
  }
  return redis.set(key, JSON.stringify(value));
};

export const cacheDel = async (key) => {
  const redis = getRedis();
  return redis.del(key);
};

export const cacheExists = async (key) => {
  const redis = getRedis();
  return redis.exists(key);
};

export const cacheIncrBy = async (key, increment = 1) => {
  const redis = getRedis();
  return redis.incrby(key, increment);
};

export const cacheDecrBy = async (key, decrement = 1) => {
  const redis = getRedis();
  return redis.decrby(key, decrement);
};

export const cacheFlush = async () => {
  const redis = getRedis();
  return redis.flushdb();
};

export default redis;
