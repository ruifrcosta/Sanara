import { PrismaClient } from '@prisma/client';
import { defaultTemplates } from '../templates/defaultTemplates';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function initTemplates() {
  try {
    logger.info('Starting template initialization...');

    for (const template of defaultTemplates) {
      await prisma.notificationTemplate.upsert({
        where: { name: template.name },
        create: {
          ...template,
          active: true
        },
        update: {
          description: template.description,
          type: template.type,
          subject: template.subject,
          content: template.content,
          active: true
        }
      });

      logger.info(`Template ${template.name} initialized successfully`);
    }

    logger.info('Template initialization completed');
  } catch (error) {
    logger.error('Failed to initialize templates:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initTemplates();
}

export { initTemplates }; 