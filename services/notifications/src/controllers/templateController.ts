import { Request, Response, NextFunction } from 'express';
import { TemplateService, CreateTemplateData, UpdateTemplateData } from '../services/templateService';
import { logger } from '../utils/logger';

const templateService = new TemplateService();

export class TemplateController {
  async createTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const templateData: CreateTemplateData = req.body;
      const template = await templateService.createTemplate(templateData);
      
      logger.info('Template created successfully');
      res.status(201).json(template);
    } catch (error) {
      next(error);
    }
  }

  async updateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const templateId = req.params.templateId;
      const templateData: UpdateTemplateData = req.body;
      const template = await templateService.updateTemplate(templateId, templateData);
      
      logger.info('Template updated successfully');
      res.json(template);
    } catch (error) {
      next(error);
    }
  }

  async getTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const nameOrId = req.params.nameOrId;
      const template = await templateService.getTemplate(nameOrId);
      
      logger.info('Template retrieved successfully');
      res.json(template);
    } catch (error) {
      next(error);
    }
  }

  async listTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as string | undefined;
      const templates = await templateService.listTemplates(type);
      
      logger.info('Templates listed successfully');
      res.json(templates);
    } catch (error) {
      next(error);
    }
  }
} 