import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { throttle, throttleConfig } from '../middlewares/throttleMiddleware';
import { productSchemas } from '../schemas/productSchemas';
import multer from 'multer';

const router = Router();
const productController = new ProductController();

// Configuração do multer para upload de arquivos
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

// Rotas públicas (mais restritivas)
router.get('/', 
  throttle(throttleConfig.public),
  productController.getAllProducts
);

router.get('/:id', 
  throttle(throttleConfig.public),
  productController.getProductById
);

router.get('/category/:category', 
  throttle(throttleConfig.public),
  productController.getProductsByCategory
);

router.get('/search', 
  throttle(throttleConfig.public),
  productController.searchProducts
);

// Rotas protegidas (menos restritivas)
router.use(authMiddleware);

// Rotas de produtos
router.post('/', 
  throttle(throttleConfig.authenticated),
  validate(productSchemas.create), 
  productController.createProduct
);

router.put('/:id', 
  throttle(throttleConfig.authenticated),
  validate(productSchemas.update), 
  productController.updateProduct
);

router.delete('/:id', 
  throttle(throttleConfig.authenticated),
  productController.deleteProduct
);

router.patch('/:id/stock', 
  throttle(throttleConfig.critical),
  validate(productSchemas.updateStock), 
  productController.updateStock
);

// Rotas de tarefas em background
router.post('/reports', 
  throttle(throttleConfig.authenticated),
  productController.generateReport
);

router.post('/import', 
  throttle(throttleConfig.upload),
  upload.single('file'),
  productController.importProducts
);

router.post('/export', 
  throttle(throttleConfig.authenticated),
  productController.exportProducts
);

router.get('/tasks/:taskId', 
  throttle(throttleConfig.authenticated),
  productController.getTaskStatus
);

router.delete('/tasks/:taskId', 
  throttle(throttleConfig.authenticated),
  productController.cancelTask
);

export { router as routes }; 