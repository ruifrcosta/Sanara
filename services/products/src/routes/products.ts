import { Router } from 'express';
import multer from 'multer';
import { ProductController } from '../controllers/productController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createProductSchema,
  updateProductSchema,
  productFilterSchema
} from '../validators/productValidators';
import { config } from '../config';

const router = Router();
const productController = new ProductController();

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

// Create product
router.post(
  '/',
  upload.array('images'),
  validateRequest(createProductSchema),
  productController.createProduct.bind(productController)
);

// Update product
router.put(
  '/:productId',
  upload.array('images'),
  validateRequest(updateProductSchema),
  productController.updateProduct.bind(productController)
);

// Get product
router.get(
  '/:productId',
  productController.getProduct.bind(productController)
);

// List products
router.get(
  '/',
  validateRequest(productFilterSchema, 'query'),
  productController.listProducts.bind(productController)
);

// Delete product
router.delete(
  '/:productId',
  productController.deleteProduct.bind(productController)
);

export const productRoutes = router; 