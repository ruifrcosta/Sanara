import { PrismaClient, Family, FamilyMember } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateFamilyData {
  name: string;
  members: Array<{
    userId: string;
    role: string;
  }>;
}

export interface UpdateFamilyData {
  name?: string;
}

export interface AddFamilyMemberData {
  userId: string;
  role: string;
}

export class FamilyService {
  async createFamily(data: CreateFamilyData) {
    try {
      const family = await prisma.family.create({
        data: {
          name: data.name,
          members: {
            create: data.members
          }
        },
        include: {
          members: {
            include: {
              user: true
            }
          }
        }
      });

      logger.info('Family created successfully', { familyId: family.id });
      return family;
    } catch (error) {
      logger.error('Failed to create family:', error);
      throw new AppError(400, 'Failed to create family');
    }
  }

  async updateFamily(familyId: string, data: UpdateFamilyData) {
    try {
      const family = await prisma.family.update({
        where: { id: familyId },
        data,
        include: {
          members: {
            include: {
              user: true
            }
          }
        }
      });

      logger.info('Family updated successfully', { familyId });
      return family;
    } catch (error) {
      logger.error('Failed to update family:', error);
      throw new AppError(400, 'Failed to update family');
    }
  }

  async getFamily(familyId: string) {
    try {
      const family = await prisma.family.findUnique({
        where: { id: familyId },
        include: {
          members: {
            include: {
              user: true
            }
          }
        }
      });

      if (!family) {
        throw new AppError(404, 'Family not found');
      }

      return family;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get family:', error);
      throw new AppError(500, 'Failed to get family');
    }
  }

  async deleteFamily(familyId: string) {
    try {
      await prisma.family.delete({
        where: { id: familyId }
      });

      logger.info('Family deleted successfully', { familyId });
    } catch (error) {
      logger.error('Failed to delete family:', error);
      throw new AppError(400, 'Failed to delete family');
    }
  }

  async addFamilyMember(familyId: string, data: AddFamilyMemberData) {
    try {
      const member = await prisma.familyMember.create({
        data: {
          familyId,
          userId: data.userId,
          role: data.role
        },
        include: {
          user: true,
          family: true
        }
      });

      logger.info('Family member added successfully', { familyId, userId: data.userId });
      return member;
    } catch (error) {
      logger.error('Failed to add family member:', error);
      throw new AppError(400, 'Failed to add family member');
    }
  }

  async removeFamilyMember(familyId: string, userId: string) {
    try {
      await prisma.familyMember.delete({
        where: {
          userId_familyId: {
            userId,
            familyId
          }
        }
      });

      logger.info('Family member removed successfully', { familyId, userId });
    } catch (error) {
      logger.error('Failed to remove family member:', error);
      throw new AppError(400, 'Failed to remove family member');
    }
  }

  async listFamilies(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [families, total] = await Promise.all([
        prisma.family.findMany({
          skip,
          take: limit,
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        }),
        prisma.family.count()
      ]);

      return {
        families,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Failed to list families:', error);
      throw new AppError(500, 'Failed to list families');
    }
  }
} 