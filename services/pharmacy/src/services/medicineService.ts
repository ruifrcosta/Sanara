import { PrismaClient, Medicine, PharmacyMedicine } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateMedicineData {
  name: string;
  activeIngredient: string;
  manufacturer: string;
  register: string;
  controlled: boolean;
  description?: string;
}

export interface UpdateMedicineData {
  name?: string;
  activeIngredient?: string;
  manufacturer?: string;
  description?: string;
}

export interface AddMedicineToPharmacyData {
  pharmacyId: string;
  medicineId: string;
  price: number;
  stock: number;
}

export interface UpdatePharmacyMedicineData {
  price?: number;
  stock?: number;
}

export class MedicineService {
  async createMedicine(data: CreateMedicineData): Promise<Medicine> {
    try {
      // Validate register number uniqueness
      await this.validateRegister(data.register);

      const medicine = await prisma.medicine.create({
        data
      });

      logger.info('Medicine created successfully', { medicineId: medicine.id });
      return medicine;
    } catch (error) {
      logger.error('Failed to create medicine:', error);
      throw error;
    }
  }

  async updateMedicine(medicineId: string, data: UpdateMedicineData): Promise<Medicine> {
    try {
      const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId }
      });

      if (!medicine) {
        throw new AppError(404, 'Medicine not found');
      }

      const updatedMedicine = await prisma.medicine.update({
        where: { id: medicineId },
        data
      });

      logger.info('Medicine updated successfully', { medicineId });
      return updatedMedicine;
    } catch (error) {
      logger.error('Failed to update medicine:', error);
      throw error;
    }
  }

  async getMedicine(medicineId: string): Promise<Medicine & { pharmacies: PharmacyMedicine[] }> {
    try {
      const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId },
        include: {
          pharmacies: true
        }
      });

      if (!medicine) {
        throw new AppError(404, 'Medicine not found');
      }

      return medicine;
    } catch (error) {
      logger.error('Failed to get medicine:', error);
      throw error;
    }
  }

  async listMedicines(page: number = 1, limit: number = 20): Promise<{ medicines: Medicine[]; total: number }> {
    try {
      const [medicines, total] = await Promise.all([
        prisma.medicine.findMany({
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.medicine.count()
      ]);

      return { medicines, total };
    } catch (error) {
      logger.error('Failed to list medicines:', error);
      throw error;
    }
  }

  async deleteMedicine(medicineId: string): Promise<void> {
    try {
      const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId },
        include: {
          pharmacies: true
        }
      });

      if (!medicine) {
        throw new AppError(404, 'Medicine not found');
      }

      if (medicine.pharmacies.length > 0) {
        throw new AppError(400, 'Cannot delete medicine that is in pharmacy inventory');
      }

      await prisma.medicine.delete({
        where: { id: medicineId }
      });

      logger.info('Medicine deleted successfully', { medicineId });
    } catch (error) {
      logger.error('Failed to delete medicine:', error);
      throw error;
    }
  }

  async addMedicineToPharmacy(data: AddMedicineToPharmacyData): Promise<PharmacyMedicine> {
    try {
      // Validate if medicine and pharmacy exist
      const [medicine, pharmacy] = await Promise.all([
        prisma.medicine.findUnique({ where: { id: data.medicineId } }),
        prisma.pharmacy.findUnique({ where: { id: data.pharmacyId } })
      ]);

      if (!medicine) {
        throw new AppError(404, 'Medicine not found');
      }

      if (!pharmacy) {
        throw new AppError(404, 'Pharmacy not found');
      }

      // Add medicine to pharmacy inventory
      const pharmacyMedicine = await prisma.pharmacyMedicine.create({
        data: {
          pharmacyId: data.pharmacyId,
          medicineId: data.medicineId,
          price: data.price,
          stock: data.stock
        }
      });

      logger.info('Medicine added to pharmacy successfully', {
        pharmacyId: data.pharmacyId,
        medicineId: data.medicineId
      });

      return pharmacyMedicine;
    } catch (error) {
      logger.error('Failed to add medicine to pharmacy:', error);
      throw error;
    }
  }

  async updatePharmacyMedicine(
    pharmacyId: string,
    medicineId: string,
    data: UpdatePharmacyMedicineData
  ): Promise<PharmacyMedicine> {
    try {
      const pharmacyMedicine = await prisma.pharmacyMedicine.findUnique({
        where: {
          pharmacyId_medicineId: {
            pharmacyId,
            medicineId
          }
        }
      });

      if (!pharmacyMedicine) {
        throw new AppError(404, 'Medicine not found in pharmacy inventory');
      }

      const updatedPharmacyMedicine = await prisma.pharmacyMedicine.update({
        where: {
          pharmacyId_medicineId: {
            pharmacyId,
            medicineId
          }
        },
        data
      });

      logger.info('Pharmacy medicine updated successfully', {
        pharmacyId,
        medicineId
      });

      return updatedPharmacyMedicine;
    } catch (error) {
      logger.error('Failed to update pharmacy medicine:', error);
      throw error;
    }
  }

  async removeMedicineFromPharmacy(pharmacyId: string, medicineId: string): Promise<void> {
    try {
      const pharmacyMedicine = await prisma.pharmacyMedicine.findUnique({
        where: {
          pharmacyId_medicineId: {
            pharmacyId,
            medicineId
          }
        }
      });

      if (!pharmacyMedicine) {
        throw new AppError(404, 'Medicine not found in pharmacy inventory');
      }

      await prisma.pharmacyMedicine.delete({
        where: {
          pharmacyId_medicineId: {
            pharmacyId,
            medicineId
          }
        }
      });

      logger.info('Medicine removed from pharmacy successfully', {
        pharmacyId,
        medicineId
      });
    } catch (error) {
      logger.error('Failed to remove medicine from pharmacy:', error);
      throw error;
    }
  }

  async searchMedicines(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ medicines: Medicine[]; total: number }> {
    try {
      const [medicines, total] = await Promise.all([
        prisma.medicine.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { activeIngredient: { contains: query, mode: 'insensitive' } },
              { manufacturer: { contains: query, mode: 'insensitive' } }
            ]
          },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.medicine.count({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { activeIngredient: { contains: query, mode: 'insensitive' } },
              { manufacturer: { contains: query, mode: 'insensitive' } }
            ]
          }
        })
      ]);

      return { medicines, total };
    } catch (error) {
      logger.error('Failed to search medicines:', error);
      throw error;
    }
  }

  private async validateRegister(register: string): Promise<void> {
    const existingMedicine = await prisma.medicine.findUnique({
      where: { register }
    });

    if (existingMedicine) {
      throw new AppError(400, 'Register number already exists');
    }
  }
} 