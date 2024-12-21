import { Request, Response, NextFunction } from 'express';
import { BrandService } from '../services/brandService';
import { logger } from '../utils/logger';

const brandService = new BrandService();

export class BrandController {
  async createBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const brand = await brandService.createBrand({
        ...req.body,
        logo: file
      });

      logger.info('Brand created successfully');
      res.status(201).json(brand);
    } catch (error) {
      next(error);
    }
  }

  async updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const { brandId } = req.params;
      const file = req.file;
      
      const brand = await brandService.updateBrand(brandId, {
        ...req.body,
        logo: file
      });

      logger.info('Brand updated successfully');
      res.json(brand);
    } catch (error) {
      next(error);
    }
  }

  async getBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const { brandId } = req.params;
      const brand = await brandService.getBrand(brandId);
      res.json(brand);
    } catch (error) {
      next(error);
    }
  }

  async listBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await brandService.listBrands();
      res.json(brands);
    } catch (error) {
      next(error);
    }
  }

  async deleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const { brandId } = req.params;
      await brandService.deleteBrand(brandId);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
} 