import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { logger } from '@sanara/logger';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => {
  logger.error('Redis error', { error: err.message });
});

export const createRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
  keyPrefix?: string;
}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again later',
    keyPrefix = 'rate-limit:',
  } = options;

  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      prefix: keyPrefix,
      // @ts-ignore - Type definitions are incorrect
      sendCommand: (...args: string[]) => redis.call(...args),
    }),
    keyGenerator: (req) => {
      // Use X-Forwarded-For header if behind a proxy
      const ip = req.headers['x-forwarded-for'] || req.ip;
      return `${keyPrefix}${ip}`;
    },
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      res.status(429).json({
        error: message,
      });
    },
  });
};

// Different rate limiters for different routes
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later',
  keyPrefix: 'rate-limit:auth:',
});

export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per minute
  message: 'Too many requests, please try again later',
  keyPrefix: 'rate-limit:api:',
});

export const healthCheckLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 health check requests per minute
  message: 'Too many health check requests',
  keyPrefix: 'rate-limit:health:',
}); 