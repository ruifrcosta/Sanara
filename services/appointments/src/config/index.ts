export const config = {
  port: process.env.PORT || 3003,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://sanara:sanara_dev@localhost:5432/sanara_dev',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://sanara:sanara_dev@localhost:5672',
    queues: {
      notifications: 'appointments.notifications',
    },
    exchanges: {
      appointments: 'appointments',
    },
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  },
  appointment: {
    defaultDuration: 30, // minutes
    maxFutureBooking: 30, // days
    minAdvanceBooking: 1, // hours
    reminderTimes: [24, 1], // hours before appointment
  }
}; 