import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const createLogger = (serviceName: string) => {
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: `logs/${serviceName}-error.log`,
        level: 'error',
      }),
      new winston.transports.File({
        filename: `logs/${serviceName}-combined.log`,
      }),
    ],
  });

  // Add Elasticsearch transport in production
  if (process.env.NODE_ENV === 'production') {
    logger.add(
      new ElasticsearchTransport({
        level: 'info',
        clientOpts: { node: process.env.ELASTICSEARCH_URL },
        index: `logs-${serviceName}`,
      })
    );
  }

  return logger;
};

export const logger = createLogger(process.env.SERVICE_NAME || 'unknown');

export const requestLogger = (serviceName: string) => {
  const serviceLogger = createLogger(serviceName);

  return (req: any, res: any, next: any) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const log = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        userAgent: req.get('user-agent'),
        ip: req.ip,
        userId: req.user?.userId,
      };

      if (res.statusCode >= 400) {
        serviceLogger.error('Request failed', log);
      } else {
        serviceLogger.info('Request completed', log);
      }
    });

    next();
  };
};

export const errorLogger = (serviceName: string) => {
  const serviceLogger = createLogger(serviceName);

  return (err: any, req: any, res: any, next: any) => {
    serviceLogger.error('Error occurred', {
      error: {
        message: err.message,
        stack: err.stack,
        status: err.status,
      },
      request: {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query,
        userId: req.user?.userId,
      },
    });

    next(err);
  };
}; 