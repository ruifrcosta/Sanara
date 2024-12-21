import { Router } from 'express';
import multer from 'multer';
import { CategoryController } from '../controllers/categoryController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema
} from '../validators/categoryValidators';
import { config } from '../config';

const router = Router();
const categoryController = new CategoryController();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Create category
router.post(
  '/',
  upload.single('image'),
  validateRequest(createCategorySchema),
  categoryController.createCategory.bind(categoryController)
);

// Update category
router.put(
  '/:categoryId',
  upload.single('image'),
  validateRequest(updateCategorySchema),
  categoryController.updateCategory.bind(categoryController)
);

// Get category
router.get(
  '/:categoryId',
  categoryController.getCategory.bind(categoryController)
);

// List categories
router.get(
  '/',
  validateRequest(categoryParamsSchema, 'query'),
  categoryController.listCategories.bind(categoryController)
);

// Delete category
router.delete(
  '/:categoryId',
  categoryController.deleteCategory.bind(categoryController)
);

export const categoryRoutes = router; 