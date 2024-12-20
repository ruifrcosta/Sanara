import { Router } from 'express';
import { TemplateController } from '../controllers/templateController';
import { validateRequest } from '../middlewares/validateRequest';
import { createTemplateSchema, updateTemplateSchema } from '../validators/templateValidators';

const router = Router();
const templateController = new TemplateController();

// Create template
router.post(
  '/',
  validateRequest(createTemplateSchema),
  templateController.createTemplate.bind(templateController)
);

// Update template
router.put(
  '/:templateId',
  validateRequest(updateTemplateSchema),
  templateController.updateTemplate.bind(templateController)
);

// Get template
router.get(
  '/:nameOrId',
  templateController.getTemplate.bind(templateController)
);

// List templates
router.get(
  '/',
  templateController.listTemplates.bind(templateController)
);

export const templateRoutes = router; 