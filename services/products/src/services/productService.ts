import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { redis } from '../config/redis';

export class ProductService {
  private prisma: PrismaClient;
  private cachePrefix = 'product:';
  private cacheTTL = 3600; // 1 hour

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllProducts({ page, limit, sort, order }: {
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
  }) {
    const skip = (page - 1) * limit;
    const cacheKey = `${this.cachePrefix}all:${page}:${limit}:${sort}:${order}`;
    
    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          category: true,
          brand: true
        }
      }),
      this.prisma.product.count()
    ]);

    const result = {
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };

    // Cache the result
    await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(result));
    
    return result;
  }

  async getProductById(id: string) {
    const cacheKey = `${this.cachePrefix}${id}`;
    
    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true
      }
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Cache the result
    await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(product));
    
    return product;
  }

  async getProductsByCategory(categoryId: string) {
    const cacheKey = `${this.cachePrefix}category:${categoryId}`;
    
    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const products = await this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        brand: true
      }
    });

    // Cache the result
    await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(products));
    
    return products;
  }

  async searchProducts(query: string) {
    const cacheKey = `${this.cachePrefix}search:${query}`;
    
    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        category: true,
        brand: true
      }
    });

    // Cache the result
    await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(products));
    
    return products;
  }

  async createProduct(data: any) {
    try {
      const product = await this.prisma.product.create({
        data,
        include: {
          category: true,
          brand: true
        }
      });

      // Invalidate relevant caches
      await this.invalidateCache();

      return product;
    } catch (error) {
      logger.error('Error creating product:', error);
      throw new ApiError(500, 'Error creating product');
    }
  }

  async updateProduct(id: string, data: any) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data,
        include: {
          category: true,
          brand: true
        }
      });

      // Invalidate relevant caches
      await this.invalidateCache(id);

      return product;
    } catch (error) {
      logger.error(`Error updating product ${id}:`, error);
      throw new ApiError(500, 'Error updating product');
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.prisma.product.delete({
        where: { id }
      });

      // Invalidate relevant caches
      await this.invalidateCache(id);
    } catch (error) {
      logger.error(`Error deleting product ${id}:`, error);
      throw new ApiError(500, 'Error deleting product');
    }
  }

  async updateStock(id: string, quantity: number) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          stock: quantity
        },
        include: {
          category: true,
          brand: true
        }
      });

      // Invalidate relevant caches
      await this.invalidateCache(id);

      return product;
    } catch (error) {
      logger.error(`Error updating stock for product ${id}:`, error);
      throw new ApiError(500, 'Error updating product stock');
    }
  }

  private async invalidateCache(productId?: string) {
    const keys = await redis.keys(`${this.cachePrefix}*`);
    if (productId) {
      // Invalidate specific product cache
      await redis.del(`${this.cachePrefix}${productId}`);
    }
    // Invalidate list caches
    await Promise.all(keys.map(key => redis.del(key)));
  }
} 