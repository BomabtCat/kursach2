require("dotenv").config();

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/it_infra",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "change_access_secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "change_refresh_secret",
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || "7d",
  refreshCookieName: process.env.REFRESH_COOKIE_NAME || "refreshToken",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 200)
};

module.exports = config;
