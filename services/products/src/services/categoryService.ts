import { PrismaClient, Category } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { UploadService } from './uploadService';

const prisma = new PrismaClient();
const uploadService = new UploadService();

export interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: string;
  image?: Express.Multer.File;
}

export interface UpdateCategoryData extends Partial<Omit<CreateCategoryData, 'image'>> {
  image?: Express.Multer.File;
  deleteImage?: boolean;
}

export class CategoryService {
  async createCategory(data: CreateCategoryData): Promise<Category> {
    try {
      // Upload image if provided
      let imageUrl: string | undefined;
      if (data.image) {
        const uploadResult = await uploadService.uploadImage(data.image);
        imageUrl = uploadResult.url;
      }

      // Generate slug from name
      const slug = this.generateSlug(data.name);

      // Create category
      const category = await prisma.category.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          parentId: data.parentId,
          image: imageUrl
        }
      });

      logger.info('Category created successfully', { categoryId: category.id });
      return category;
    } catch (error) {
      logger.error('Failed to create category:', error);
      throw error;
    }
  }

  async updateCategory(categoryId: string, data: UpdateCategoryData): Promise<Category> {
    try {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        throw new AppError(404, 'Category not found');
      }

      // Handle image updates
      let imageUrl = category.image;
      if (data.deleteImage && category.image) {
        const publicId = this.extractPublicId(category.image);
        if (publicId) {
          await uploadService.deleteImage(publicId);
        }
        imageUrl = null;
      }
      if (data.image) {
        const uploadResult = await uploadService.uploadImage(data.image);
        imageUrl = uploadResult.url;
      }

      // Generate new slug if name is updated
      const slug = data.name ? this.generateSlug(data.name) : undefined;

      // Update category
      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: {
          name: data.name,
          slug,
          description: data.description,
          parentId: data.parentId,
          image: imageUrl
        }
      });

      logger.info('Category updated successfully', { categoryId });
      return updatedCategory;
    } catch (error) {
      logger.error('Failed to update category:', error);
      throw error;
    }
  }

  async getCategory(categoryId: string): Promise<Category> {
    try {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          parent: true,
          children: true,
          products: {
            include: {
              images: true,
              inventory: true
            }
          }
        }
      });

      if (!category) {
        throw new AppError(404, 'Category not found');
      }

      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get category:', error);
      throw new AppError(500, 'Failed to get category');
    }
  }

  async listCategories(parentId?: string): Promise<Category[]> {
    try {
      return await prisma.category.findMany({
        where: { parentId },
        include: {
          children: true,
          _count: {
            select: { products: true }
          }
        },
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      logger.error('Failed to list categories:', error);
      throw new AppError(500, 'Failed to list categories');
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          children: true,
          products: true
        }
      });

      if (!category) {
        throw new AppError(404, 'Category not found');
      }

      // Check if category has children or products
      if (category.children.length > 0) {
        throw new AppError(400, 'Cannot delete category with subcategories');
      }
      if (category.products.length > 0) {
        throw new AppError(400, 'Cannot delete category with products');
      }

      // Delete category image if exists
      if (category.image) {
        const publicId = this.extractPublicId(category.image);
        if (publicId) {
          await uploadService.deleteImage(publicId);
        }
      }

      // Delete category
      await prisma.category.delete({
        where: { id: categoryId }
      });

      logger.info('Category deleted successfully', { categoryId });
    } catch (error) {
      logger.error('Failed to delete category:', error);
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