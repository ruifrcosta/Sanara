import { PrismaClient, User, Address, HealthProfile } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateUserData {
  email: string;
  name: string;
  birthDate?: Date;
  gender?: string;
  phoneNumber?: string;
  address?: Omit<Address, 'id' | 'userId'>;
  healthProfile?: Omit<HealthProfile, 'id' | 'userId'>;
}

export interface UpdateUserData extends Partial<CreateUserData> {}

export class UserService {
  async createUser(data: CreateUserData) {
    try {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          birthDate: data.birthDate,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          address: data.address ? {
            create: data.address
          } : undefined,
          healthProfile: data.healthProfile ? {
            create: data.healthProfile
          } : undefined
        },
        include: {
          address: true,
          healthProfile: true
        }
      });

      logger.info('User created successfully', { userId: user.id });
      return user;
    } catch (error) {
      logger.error('Failed to create user:', error);
      throw new AppError(400, 'Failed to create user');
    }
  }

  async updateUser(userId: string, data: UpdateUserData) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          email: data.email,
          name: data.name,
          birthDate: data.birthDate,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          address: data.address ? {
            upsert: {
              create: data.address,
              update: data.address
            }
          } : undefined,
          healthProfile: data.healthProfile ? {
            upsert: {
              create: data.healthProfile,
              update: data.healthProfile
            }
          } : undefined
        },
        include: {
          address: true,
          healthProfile: true
        }
      });

      logger.info('User updated successfully', { userId });
      return user;
    } catch (error) {
      logger.error('Failed to update user:', error);
      throw new AppError(400, 'Failed to update user');
    }
  }

  async getUser(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          address: true,
          healthProfile: true,
          families: {
            include: {
              family: true
            }
          }
        }
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get user:', error);
      throw new AppError(500, 'Failed to get user');
    }
  }

  async deleteUser(userId: string) {
    try {
      await prisma.user.delete({
        where: { id: userId }
      });

      logger.info('User deleted successfully', { userId });
    } catch (error) {
      logger.error('Failed to delete user:', error);
      throw new AppError(400, 'Failed to delete user');
    }
  }

  async listUsers(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          include: {
            address: true,
            healthProfile: true
          }
        }),
        prisma.user.count()
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Failed to list users:', error);
      throw new AppError(500, 'Failed to list users');
    }
  }
} 