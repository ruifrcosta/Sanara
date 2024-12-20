export const config = {
  port: process.env.PORT || 3002,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://sanara:sanara_dev@localhost:5432/sanara_dev',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  }
}; 