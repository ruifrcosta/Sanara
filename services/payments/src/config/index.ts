export const config = {
  port: process.env.PORT || 3005,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    apiVersion: '2023-10-16' as const
  },

  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    exchanges: {
      payments: 'payments.exchange'
    },
    queues: {
      payments: 'payments.queue',
      orders: 'orders.payments.queue'
    }
  },

  services: {
    orders: process.env.ORDERS_SERVICE_URL || 'http://localhost:3006',
    users: process.env.USERS_SERVICE_URL || 'http://localhost:3002'
  }
}; 