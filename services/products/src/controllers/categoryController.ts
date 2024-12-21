import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService';
import { logger } from '../utils/logger';

const categoryService = new CategoryService();

export class CategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const category = await categoryService.createCategory({
        ...req.body,
        image: file
      });

      logger.info('Category created successfully');
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;
      const file = req.file;
      
      const category = await categoryService.updateCategory(categoryId, {
        ...req.body,
        image: file
      });

      logger.info('Category updated successfully');
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;
      const category = await categoryService.getCategory(categoryId);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async listCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentId } = req.query;
      const categories = await categoryService.listCategories(parentId as string);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;
      await categoryService.deleteCategory(categoryId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
} 