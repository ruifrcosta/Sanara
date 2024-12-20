import { PrismaClient, Brand } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { UploadService } from './uploadService';

const prisma = new PrismaClient();
const uploadService = new UploadService();

export interface CreateBrandData {
  name: string;
  description?: string;
  logo?: Express.Multer.File;
}

export interface UpdateBrandData extends Partial<Omit<CreateBrandData, 'logo'>> {
  logo?: Express.Multer.File;
  deleteLogo?: boolean;
}

export class BrandService {
  async createBrand(data: CreateBrandData): Promise<Brand> {
    try {
      // Upload logo if provided
      let logoUrl: string | undefined;
      if (data.logo) {
        const uploadResult = await uploadService.uploadImage(data.logo);
        logoUrl = uploadResult.url;
      }

      // Generate slug from name
      const slug = this.generateSlug(data.name);

      // Create brand
      const brand = await prisma.brand.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          logo: logoUrl
        }
      });

      logger.info('Brand created successfully', { brandId: brand.id });
      return brand;
    } catch (error) {
      logger.error('Failed to create brand:', error);
      throw error;
    }
  }

  async updateBrand(brandId: string, data: UpdateBrandData): Promise<Brand> {
    try {
      const brand = await prisma.brand.findUnique({
        where: { id: brandId }
      });

      if (!brand) {
        throw new AppError(404, 'Brand not found');
      }

      // Handle logo updates
      let logoUrl = brand.logo;
      if (data.deleteLogo && brand.logo) {
        const publicId = this.extractPublicId(brand.logo);
        if (publicId) {
          await uploadService.deleteImage(publicId);
        }
        logoUrl = null;
      }
      if (data.logo) {
        const uploadResult = await uploadService.uploadImage(data.logo);
        logoUrl = uploadResult.url;
      }

      // Generate new slug if name is updated
      const slug = data.name ? this.generateSlug(data.name) : undefined;

      // Update brand
      const updatedBrand = await prisma.brand.update({
        where: { id: brandId },
        data: {
          name: data.name,
          slug,
          description: data.description,
          logo: logoUrl
        }
      });

      logger.info('Brand updated successfully', { brandId });
      return updatedBrand;
    } catch (error) {
      logger.error('Failed to update brand:', error);
      throw error;
    }
  }

  async getBrand(brandId: string): Promise<Brand> {
    try {
      const brand = await prisma.brand.findUnique({
        where: { id: brandId },
        include: {
          products: {
            include: {
              images: true,
              inventory: true
            }
          }
        }
      });

      if (!brand) {
        throw new AppError(404, 'Brand not found');
      }

      return brand;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get brand:', error);
      throw new AppError(500, 'Failed to get brand');
    }
  }

  async listBrands(): Promise<Brand[]> {
    try {
      return await prisma.brand.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        },
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      logger.error('Failed to list brands:', error);
      throw new AppError(500, 'Failed to list brands');
    }
  }

  async deleteBrand(brandId: string): Promise<void> {
    try {
      const brand = await prisma.brand.findUnique({
        where: { id: brandId },
        include: {
          products: true
        }
      });

      if (!brand) {
        throw new AppError(404, 'Brand not found');
      }

      // Check if brand has products
      if (brand.products.length > 0) {
        throw new AppError(400, 'Cannot delete brand with products');
      }

      // Delete brand logo if exists
      if (brand.logo) {
        const publicId = this.extractPublicId(brand.logo);
        if (publicId) {
          await uploadService.deleteImage(publicId);
        }
      }

      // Delete brand
      await prisma.brand.delete({
        where: { id: brandId }
      });

      logger.info('Brand deleted successfully', { brandId });
    } catch (error) {
      logger.error('Failed to delete brand:', error);
      throw error;
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private extractPublicId(url: string): string | null {
    const match = url.match(/\/v\d+\/([^/]+)\.\w+$/);
    return match ? match[1] : null;
  }
} 