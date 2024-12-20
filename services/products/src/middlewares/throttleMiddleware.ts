import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';

interface ThrottleOptions {
  windowMs?: number;
  maxRequests?: number;
  keyPrefix?: string;
  message?: string;
  statusCode?: number;
  handler?: (req: Request, res: Response) => void;
}

export function throttle(options: ThrottleOptions = {}) {
  const {
    windowMs = 60 * 1000, // 1 minuto
    maxRequests = 100,
    keyPrefix = 'throttle:',
    message = 'Too many requests, please try again later.',
    statusCode = 429,
    handler
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Gerar chave única para o cliente
      const key = `${keyPrefix}${req.ip}`;

      // Obter contagem atual de requisições
      const currentRequests = await redis.incr(key);

      // Se é a primeira requisição, definir o tempo de expiração
      if (currentRequests === 1) {
        await redis.expire(key, Math.round(windowMs / 1000));
      }

      // Verificar se excedeu o limite
      if (currentRequests > maxRequests) {
        // Obter tempo restante para reset
        const ttl = await redis.ttl(key);

        // Adicionar headers de rate limit
        res.set({
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + (ttl * 1000)).toUTCString(),
          'Retry-After': ttl.toString()
        });

        // Se houver um handler personalizado, usá-lo
        if (handler) {
          return handler(req, res);
        }

        // Caso contrário, retornar erro padrão
        logger.warn(`Rate limit exceeded for IP ${req.ip}`);
        throw new ApiError(statusCode, message);
      }

      // Adicionar headers de rate limit
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': (maxRequests - currentRequests).toString(),
        'X-RateLimit-Reset': new Date(Date.now() + (await redis.ttl(key) * 1000)).toUTCString()
      });

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
      } else {
        logger.error('Error in throttle middleware:', error);
        next(new ApiError(500, 'Internal server error'));
      }
    }
  };
}

// Configurações específicas para diferentes tipos de endpoints
export const throttleConfig = {
  // Endpoints públicos (mais restritivo)
  public: {
    windowMs: 60 * 1000, // 1 minuto
    maxRequests: 100
  },

  // Endpoints autenticados (menos restritivo)
  authenticated: {
    windowMs: 60 * 1000,
    maxRequests: 300
  },

  // Endpoints de API (configuração personalizada)
  api: {
    windowMs: 60 * 1000,
    maxRequests: 500
  },

  // Endpoints críticos (muito restritivo)
  critical: {
    windowMs: 60 * 1000,
    maxRequests: 50
  },

  // Endpoints de upload (configuração específica)
  upload: {
    windowMs: 5 * 60 * 1000, // 5 minutos
    maxRequests: 10
  }
}; 