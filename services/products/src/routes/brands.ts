import { Router } from 'express';
import multer from 'multer';
import { BrandController } from '../controllers/brandController';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createBrandSchema,
  updateBrandSchema
} from '../validators/brandValidators';
import { config } from '../config';

const router = Router();
const brandController = new BrandController();

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

// Create brand
router.post(
  '/',
  upload.single('logo'),
  validateRequest(createBrandSchema),
  brandController.createBrand.bind(brandController)
);

// Update brand
router.put(
  '/:brandId',
  upload.single('logo'),
  validateRequest(updateBrandSchema),
  brandController.updateBrand.bind(brandController)
);

// Get brand
router.get(
  '/:brandId',
  brandController.getBrand.bind(brandController)
);

// List brands
router.get(
  '/',
  brandController.listBrands.bind(brandController)
);

// Delete brand
router.delete(
  '/:brandId',
  brandController.deleteBrand.bind(brandController)
);

export const brandRoutes = router; 