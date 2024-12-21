declare module 'pg' {
  interface PoolConfig {
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    ssl?: boolean | { rejectUnauthorized: boolean };
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
  }
}

import { Pool, PoolConfig, QueryResult } from 'pg';
import { logger } from '../utils/logger';

interface PostgresConfig {
  poolConfig: PoolConfig;
}

const {
  POSTGRES_HOST = 'localhost',
  POSTGRES_PORT = '5432',
  POSTGRES_DB = 'healthcare',
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD,
  POSTGRES_SSL = 'false'
} = process.env;

const config: PostgresConfig = {
  poolConfig: {
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT),
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    ssl: POSTGRES_SSL === 'true' ? {
      rejectUnauthorized: false
    } : undefined,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
};

const pool = new Pool(config.poolConfig);

pool.on('error', (err: Error) => {
  logger.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

export const pgPool = pool;

export async function connectPostgres(): Promise<void> {
  try {
    const client = await pool.connect();
    client.release();
    logger.info('Successfully connected to PostgreSQL');
  } catch (error) {
    logger.error('Error connecting to PostgreSQL:', error);
    process.exit(1);
  }
}

export async function closePostgres(): Promise<void> {
  try {
    await pool.end();
    logger.info('PostgreSQL connection pool closed');
  } catch (error) {
    logger.error('Error closing PostgreSQL connection pool:', error);
    throw error;
  }
}

export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error('Error executing query:', { text, error });
    throw error;
  }
} 