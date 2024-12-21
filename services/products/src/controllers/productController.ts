import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { BackgroundTaskService } from '../services/BackgroundTaskService';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';

export class ProductController {
  private productService: ProductService;
  private backgroundTaskService: BackgroundTaskService;

  constructor() {
    this.productService = new ProductService();
    this.backgroundTaskService = new BackgroundTaskService();
  }

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
      const products = await this.productService.getAllProducts({
        page: Number(page),
        limit: Number(limit),
        sort: String(sort),
        order: String(order)
      });
      res.json(products);
    } catch (error) {
      logger.error('Error getting all products:', error);
      throw new ApiError(500, 'Error retrieving products');
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }
      res.json(product);
    } catch (error) {
      logger.error(`Error getting product ${req.params.id}:`, error);
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error retrieving product');
    }
  };

  getProductsByCategory = async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const products = await this.productService.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      logger.error(`Error getting products by category ${req.params.category}:`, error);
      throw new ApiError(500, 'Error retrieving products by category');
    }
  };

  searchProducts = async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q) throw new ApiError(400, 'Search query is required');
      const products = await this.productService.searchProducts(String(q));
      res.json(products);
    } catch (error) {
      logger.error(`Error searching products with query ${req.query.q}:`, error);
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error searching products');
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.createProduct(req.body);

      // Se houver imagem, otimizar em background
      if (req.body.image) {
        const pid = await this.backgroundTaskService.processImageOptimization(req.body.image);
        logger.info(`Started image optimization for product ${product.id} with PID ${pid}`);
      }

      res.status(201).json(product);
    } catch (error) {
      logger.error('Error creating product:', error);
      throw new ApiError(500, 'Error creating product');
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.productService.updateProduct(id, req.body);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      // Se houver nova imagem, otimizar em background
      if (req.body.image) {
        const pid = await this.backgroundTaskService.processImageOptimization(req.body.image);
        logger.info(`Started image optimization for updated product ${id} with PID ${pid}`);
      }

      res.json(product);
    } catch (error) {
      logger.error(`Error updating product ${req.params.id}:`, error);
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating product');
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting product ${req.params.id}:`, error);
      throw new ApiError(500, 'Error deleting product');
    }
  };

  updateStock = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const product = await this.productService.updateStock(id, quantity);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }
      res.json(product);
    } catch (error) {
      logger.error(`Error updating stock for product ${req.params.id}:`, error);
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating product stock');
    }
  };

  generateReport = async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const pid = await this.backgroundTaskService.generateProductReport(filters);
      res.json({
        message: 'Report generation started',
        taskId: pid
      });
    } catch (error) {
      logger.error('Error starting report generation:', error);
      throw new ApiError(500, 'Error generating report');
    }
  };

  importProducts = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        throw new ApiError(400, 'No file uploaded');
      }

      const pid = await this.backgroundTaskService.processDataImport(req.file.path);
      res.json({
        message: 'Product import started',
        taskId: pid
      });
    } catch (error) {
      logger.error('Error starting product import:', error);
      throw new ApiError(500, 'Error importing products');
    }
  };

  exportProducts = async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const pid = await this.backgroundTaskService.processDataExport(filters);
      res.json({
        message: 'Product export started',
        taskId: pid
      });
    } catch (error) {
      logger.error('Error starting product export:', error);
      throw new ApiError(500, 'Error exporting products');
    }
  };

  getTaskStatus = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const status = this.backgroundTaskService.getTaskStatus(Number(taskId));
      res.json(status);
    } catch (error) {
      logger.error(`Error getting task status for task ${req.params.taskId}:`, error);
      throw new ApiError(500, 'Error getting task status');
    }
  };

  cancelTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      this.backgroundTaskService.killTask(Number(taskId));
      res.json({ message: 'Task cancelled successfully' });
    } catch (error) {
      logger.error(`Error cancelling task ${req.params.taskId}:`, error);
      throw new ApiError(500, 'Error cancelling task');
    }
  };
} 