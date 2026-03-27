import * as Joi from "joi";

export const configValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  DB_POOL_MAX: Joi.number().default(20),
  DB_POOL_IDLE_TIMEOUT_MS: Joi.number().default(30000),
  DB_POOL_CONNECTION_TIMEOUT_MS: Joi.number().default(5000),
  DB_QUERY_TIMEOUT_MS: Joi.number().default(10000),
  DB_SLOW_QUERY_MS: Joi.number().default(200),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("24h"),
  CACHE_STORE: Joi.string().valid("memory", "redis").default("memory"),
  CACHE_TTL_MS: Joi.number().default(60000),
  CACHE_REDIS_URL: Joi.string().optional(),
  PORT: Joi.number().default(5001),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  CORS_ORIGIN: Joi.string().default("*"),
}).options({ allowUnknown: true });

export default () => ({
  database: {
    url: process.env.DATABASE_URL,
    poolMax: parseInt(process.env.DB_POOL_MAX ?? "20", 10),
    poolIdleTimeoutMs: parseInt(
      process.env.DB_POOL_IDLE_TIMEOUT_MS ?? "30000",
      10,
    ),
    poolConnectionTimeoutMs: parseInt(
      process.env.DB_POOL_CONNECTION_TIMEOUT_MS ?? "5000",
      10,
    ),
    queryTimeoutMs: parseInt(process.env.DB_QUERY_TIMEOUT_MS ?? "10000", 10),
    slowQueryMs: parseInt(process.env.DB_SLOW_QUERY_MS ?? "200", 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  port: parseInt(process.env.PORT ?? "5001", 10),
  cache: {
    store: process.env.CACHE_STORE ?? "memory",
    ttlMs: parseInt(process.env.CACHE_TTL_MS ?? "60000", 10),
    redisUrl: process.env.CACHE_REDIS_URL,
  },
  corsOrigin: process.env.CORS_ORIGIN || "*",
  nodeEnv: process.env.NODE_ENV || "development",
});
