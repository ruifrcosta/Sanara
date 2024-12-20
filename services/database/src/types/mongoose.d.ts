declare module 'mongoose' {
  import { Connection, ConnectOptions } from 'mongoose';
  
  interface MongooseError extends Error {
    code?: number;
    name?: string;
  }

  interface MongooseConnection extends Connection {
    readyState: number;
  }

  interface MongooseConnectOptions extends ConnectOptions {
    authSource?: string;
    user?: string;
    pass?: string;
    retryWrites?: boolean;
    w?: string;
    maxPoolSize?: number;
    serverSelectionTimeoutMS?: number;
    socketTimeoutMS?: number;
  }

  export * from 'mongoose';
  export { Connection, ConnectOptions, MongooseError, MongooseConnection, MongooseConnectOptions };
} 