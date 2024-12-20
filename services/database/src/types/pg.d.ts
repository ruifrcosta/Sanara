declare module 'pg' {
  import { Pool, PoolConfig, QueryResult } from 'pg';
  
  export * from 'pg';
  export { Pool, PoolConfig, QueryResult };
} 