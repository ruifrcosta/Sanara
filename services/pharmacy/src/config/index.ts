export const config = {
  port: process.env.PORT || 3009,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://sanara:sanara_dev@localhost:5432/sanara_dev'
  },

  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://sanara:sanara_dev@localhost:5672',
    exchanges: {
      pharmacy: 'pharmacy.exchange'
    },
    queues: {
      orders: 'pharmacy.orders.queue',
      inventory: 'pharmacy.inventory.queue',
      notifications: 'pharmacy.notifications.queue'
    }
  },

  services: {
    products: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3006',
    orders: process.env.ORDERS_SERVICE_URL || 'http://localhost:3007',
    notifications: process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3004'
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },

  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },

  geocoding: {
    apiKey: process.env.GEOCODING_API_KEY,
    enabled: process.env.GEOCODING_ENABLED === 'true'
  }
}; 