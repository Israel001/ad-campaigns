export interface RedisConfig {
  /**
   * Redis connection host
   */
  redisHost: string;
  /**
   *  Redis connection port
   */
  redisPort: string;

  /**
   * Redis TTL
   */
  redisTTL: string;

  redisDb: number;

  cacheExpiry: number;
}
