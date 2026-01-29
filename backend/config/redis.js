const redis = require('redis');
const customLogger = require('../utils/logger');

let redisClient = null;

const connectRedis = async () => {
  try {
    // Check if Redis is configured
    if (!process.env.REDIS_URL) {
      customLogger.warning('Redis not configured - skipping Redis connection');
      return null;
    }

    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          customLogger.error('Redis server connection refused');
          return new Error('Redis server connection refused');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          customLogger.error('Redis retry time exhausted');
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          customLogger.error('Redis max retry attempts reached');
          return undefined;
        }
        // Retry after 3 seconds
        return Math.min(options.attempt * 100, 3000);
      }
    });

    redisClient.on('connect', () => {
      customLogger.success('Redis connection established');
    });

    redisClient.on('ready', () => {
      customLogger.success('Redis client ready');
    });

    redisClient.on('error', (err) => {
      customLogger.error('Redis connection error');
      customLogger.error(`Error: ${err.message}`);
    });

    redisClient.on('end', () => {
      customLogger.warning('Redis connection ended');
    });

    await redisClient.connect();
    customLogger.success('Redis connected successfully');
    
    return redisClient;
  } catch (error) {
    customLogger.error('Redis connection failed');
    customLogger.error(`Error: ${error.message}`);
    return null;
  }
};

const getRedisClient = () => redisClient;

const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    customLogger.info('Redis connection closed');
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  disconnectRedis
};
