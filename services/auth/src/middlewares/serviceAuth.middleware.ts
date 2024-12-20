import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

const SERVICE_API_KEYS = {
  appointments: process.env.APPOINTMENTS_API_KEY,
  patients: process.env.PATIENTS_API_KEY,
  analytics: process.env.ANALYTICS_API_KEY,
};

export const validateServiceAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const service = req.headers['x-service-name'] as keyof typeof SERVICE_API_KEYS;

    if (!apiKey || !service) {
      throw new AppError(401, 'Missing service authentication');
    }

    const validApiKey = SERVICE_API_KEYS[service];
    if (!validApiKey || apiKey !== validApiKey) {
      throw new AppError(401, 'Invalid service authentication');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const generateServiceToken = (service: keyof typeof SERVICE_API_KEYS) => {
  const apiKey = SERVICE_API_KEYS[service];
  if (!apiKey) {
    throw new Error(`Invalid service: ${service}`);
  }
  return apiKey;
}; 