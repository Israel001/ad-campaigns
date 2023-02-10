import { registerAs } from '@nestjs/config';
import { RedisConfig } from './types/redis.config';

export const RedisConfiguration = registerAs(
  'redisConfig',
  (): RedisConfig => ({
    redisHost: process.env.REDIS_HOST,
    redisTTL: process.env.REDIS_TTL,
    redisPort: process.env.REDIS_PORT,
    redisDb: parseInt(process.env.REDIS_DB),
    cacheExpiry: Number(process.env.CACHE_TTL) || 86400
  }),
);
