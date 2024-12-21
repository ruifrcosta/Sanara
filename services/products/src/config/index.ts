export const config = {
  port: process.env.PORT || 3006,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://sanara:sanara_dev@localhost:5432/sanara_dev'
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'sanara/products'
  },

  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://sanara:sanara_dev@localhost:5672',
    exchanges: {
      products: 'products.exchange'
    },
    queues: {
      products: 'products.queue',
      inventory: 'products.inventory.queue'
    }
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },

  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },

  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  }
}; 