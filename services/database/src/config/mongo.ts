import mongoose from 'mongoose';
import { logger } from '../utils/logger';

interface MongoConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

const {
  MONGODB_URI = 'mongodb://localhost:27017/healthcare',
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_AUTH_SOURCE = 'admin'
} = process.env;

const config: MongoConfig = {
  uri: MONGODB_URI,
  options: {
    authSource: MONGODB_AUTH_SOURCE,
    user: MONGODB_USER,
    pass: MONGODB_PASSWORD,
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

export async function connectMongoDB(): Promise<void> {
  try {
    await mongoose.connect(config.uri, config.options);
    logger.info('Successfully connected to MongoDB');

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        if (error instanceof Error) {
          logger.error('Error closing MongoDB connection:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
        }
        process.exit(1);
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Error connecting to MongoDB:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    process.exit(1);
  }
} 