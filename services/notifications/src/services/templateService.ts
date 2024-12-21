import { PrismaClient, NotificationTemplate } from '@prisma/client';
import Handlebars from 'handlebars';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateTemplateData {
  name: string;
  description: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
  subject?: string;
  content: string;
}

export interface UpdateTemplateData {
  description?: string;
  subject?: string;
  content?: string;
  active?: boolean;
}

export class TemplateService {
  async createTemplate(data: CreateTemplateData) {
    try {
      // Validate template syntax
      this.validateTemplate(data.content);

      const template = await prisma.notificationTemplate.create({
        data: {
          name: data.name,
          description: data.description,
          type: data.type,
          subject: data.subject,
          content: data.content,
          active: true
        }
      });

      logger.info('Template created successfully', { templateId: template.id });
      return template;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to create template:', error);
      throw new AppError(500, 'Failed to create template');
    }
  }

  async updateTemplate(templateId: string, data: UpdateTemplateData) {
    try {
      // Validate template syntax if content is being updated
      if (data.content) {
        this.validateTemplate(data.content);
      }

      const template = await prisma.notificationTemplate.update({
        where: { id: templateId },
        data
      });

      logger.info('Template updated successfully', { templateId });
      return template;
    } catch (error) {
      logger.error('Failed to update template:', error);
      throw new AppError(400, 'Failed to update template');
    }
  }

  async getTemplate(nameOrId: string) {
    try {
      const template = await prisma.notificationTemplate.findFirst({
        where: {
          OR: [
            { id: nameOrId },
            { name: nameOrId }
          ],
          active: true
        }
      });

      if (!template) {
        throw new AppError(404, 'Template not found');
      }

      return template;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get template:', error);
      throw new AppError(500, 'Failed to get template');
    }
  }

  async listTemplates(type?: string) {
    try {
      const templates = await prisma.notificationTemplate.findMany({
        where: {
          type: type ? type : undefined,
          active: true
        },
        orderBy: {
          name: 'asc'
        }
      });

      return templates;
    } catch (error) {
      logger.error('Failed to list templates:', error);
      throw new AppError(500, 'Failed to list templates');
    }
  }

  processTemplate(template: NotificationTemplate, data: Record<string, any>) {
    try {
      const compiledTemplate = Handlebars.compile(template.content);
      const content = compiledTemplate(data);

      let title = '';
      if (template.subject) {
        const compiledSubject = Handlebars.compile(template.subject);
        title = compiledSubject(data);
      }

      return {
        title: title || 'Notification',
        content
      };
    } catch (error) {
      logger.error('Failed to process template:', error);
      throw new AppError(500, 'Failed to process template');
    }
  }

  private validateTemplate(content: string) {
    try {
      Handlebars.compile(content);
    } catch (error) {
      logger.error('Invalid template syntax:', error);
      throw new AppError(400, 'Invalid template syntax');
    }
  }
} 