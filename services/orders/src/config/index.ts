export const config = {
  port: process.env.PORT || 3007,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://sanara:sanara_dev@localhost:5432/sanara_dev'
  },

  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://sanara:sanara_dev@localhost:5672',
    exchanges: {
      orders: 'orders.exchange'
    },
    queues: {
      orders: 'orders.queue',
      payments: 'orders.payments.queue',
      notifications: 'orders.notifications.queue',
      inventory: 'orders.inventory.queue'
    }
  },

  services: {
    products: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3006',
    payments: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3005',
    users: process.env.USERS_SERVICE_URL || 'http://localhost:3002'
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },

  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },

  tax: {
    rate: 0.1, // 10%
    includeInTotal: true
  },

  shipping: {
    baseRate: 10.0,
    freeShippingThreshold: 100.0
  }
}; 