import { PrismaClient, Prescription, PrescriptionStatus, PrescriptionMedicine } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import axios from 'axios';
import { config } from '../config';

const prisma = new PrismaClient();

export interface CreatePrescriptionData {
  pharmacyId: string;
  userId: string;
  doctorId: string;
  expirationDate: Date;
  medicines: Array<{
    medicineId: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
}

export interface UpdatePrescriptionData {
  status?: PrescriptionStatus;
}

export class PrescriptionService {
  async createPrescription(data: CreatePrescriptionData): Promise<Prescription & { medicines: PrescriptionMedicine[] }> {
    try {
      // Validate if pharmacy exists
      const pharmacy = await prisma.pharmacy.findUnique({
        where: { id: data.pharmacyId }
      });

      if (!pharmacy) {
        throw new AppError(404, 'Pharmacy not found');
      }

      // Validate if user exists
      await this.validateUser(data.userId);

      // Validate if doctor exists
      await this.validateDoctor(data.doctorId);

      // Validate medicines
      await this.validateMedicines(data.medicines.map(m => m.medicineId));

      // Create prescription with medicines
      const prescription = await prisma.prescription.create({
        data: {
          pharmacyId: data.pharmacyId,
          userId: data.userId,
          doctorId: data.doctorId,
          status: PrescriptionStatus.PENDING,
          expirationDate: data.expirationDate,
          medicines: {
            create: data.medicines
          }
        },
        include: {
          medicines: true
        }
      });

      // Send notification to pharmacy
      await this.notifyPharmacy(prescription);

      logger.info('Prescription created successfully', { prescriptionId: prescription.id });
      return prescription;
    } catch (error) {
      logger.error('Failed to create prescription:', error);
      throw error;
    }
  }

  async updatePrescription(
    prescriptionId: string,
    data: UpdatePrescriptionData
  ): Promise<Prescription & { medicines: PrescriptionMedicine[] }> {
    try {
      const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: { medicines: true }
      });

      if (!prescription) {
        throw new AppError(404, 'Prescription not found');
      }

      // Validate status transition
      if (data.status) {
        this.validateStatusTransition(prescription.status, data.status);
      }

      // Update prescription
      const updatedPrescription = await prisma.prescription.update({
        where: { id: prescriptionId },
        data: {
          status: data.status,
          updatedAt: new Date()
        },
        include: {
          medicines: true
        }
      });

      // Handle status-specific actions
      if (data.status) {
        await this.handleStatusChange(updatedPrescription);
      }

      logger.info('Prescription updated successfully', { prescriptionId });
      return updatedPrescription;
    } catch (error) {
      logger.error('Failed to update prescription:', error);
      throw error;
    }
  }

  async getPrescription(prescriptionId: string): Promise<Prescription & { medicines: PrescriptionMedicine[] }> {
    try {
      const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
          medicines: true
        }
      });

      if (!prescription) {
        throw new AppError(404, 'Prescription not found');
      }

      return prescription;
    } catch (error) {
      logger.error('Failed to get prescription:', error);
      throw error;
    }
  }

  async listUserPrescriptions(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ prescriptions: (Prescription & { medicines: PrescriptionMedicine[] })[]; total: number }> {
    try {
      const [prescriptions, total] = await Promise.all([
        prisma.prescription.findMany({
          where: { userId },
          include: {
            medicines: true
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.prescription.count({ where: { userId } })
      ]);

      return { prescriptions, total };
    } catch (error) {
      logger.error('Failed to list user prescriptions:', error);
      throw error;
    }
  }

  async listPharmacyPrescriptions(
    pharmacyId: string,
    status?: PrescriptionStatus,
    page: number = 1,
    limit: number = 20
  ): Promise<{ prescriptions: (Prescription & { medicines: PrescriptionMedicine[] })[]; total: number }> {
    try {
      const where = {
        pharmacyId,
        ...(status && { status })
      };

      const [prescriptions, total] = await Promise.all([
        prisma.prescription.findMany({
          where,
          include: {
            medicines: true
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.prescription.count({ where })
      ]);

      return { prescriptions, total };
    } catch (error) {
      logger.error('Failed to list pharmacy prescriptions:', error);
      throw error;
    }
  }

  private async validateUser(userId: string): Promise<void> {
    try {
      await axios.get(`${config.services.users}/users/${userId}`);
    } catch (error) {
      throw new AppError(404, 'User not found');
    }
  }

  private async validateDoctor(doctorId: string): Promise<void> {
    try {
      await axios.get(`${config.services.professionals}/doctors/${doctorId}`);
    } catch (error) {
      throw new AppError(404, 'Doctor not found');
    }
  }

  private async validateMedicines(medicineIds: string[]): Promise<void> {
    const medicines = await prisma.medicine.findMany({
      where: {
        id: {
          in: medicineIds
        }
      }
    });

    if (medicines.length !== medicineIds.length) {
      throw new AppError(400, 'One or more medicines not found');
    }
  }

  private validateStatusTransition(currentStatus: PrescriptionStatus, newStatus: PrescriptionStatus): void {
    const allowedTransitions: Record<PrescriptionStatus, PrescriptionStatus[]> = {
      PENDING: [PrescriptionStatus.APPROVED, PrescriptionStatus.REJECTED],
      APPROVED: [PrescriptionStatus.DISPENSED, PrescriptionStatus.CANCELLED],
      REJECTED: [],
      DISPENSED: [],
      EXPIRED: [],
      CANCELLED: []
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new AppError(400, `Cannot transition prescription from ${currentStatus} to ${newStatus}`);
    }
  }

  private async handleStatusChange(prescription: Prescription & { medicines: PrescriptionMedicine[] }): Promise<void> {
    switch (prescription.status) {
      case PrescriptionStatus.APPROVED:
        await this.handlePrescriptionApproved(prescription);
        break;
      case PrescriptionStatus.REJECTED:
        await this.handlePrescriptionRejected(prescription);
        break;
      case PrescriptionStatus.DISPENSED:
        await this.handlePrescriptionDispensed(prescription);
        break;
      case PrescriptionStatus.CANCELLED:
        await this.handlePrescriptionCancelled(prescription);
        break;
    }
  }

  private async handlePrescriptionApproved(prescription: Prescription): Promise<void> {
    // Send notification to user
    await this.notifyUser(prescription, 'PRESCRIPTION_APPROVED');
  }

  private async handlePrescriptionRejected(prescription: Prescription): Promise<void> {
    // Send notification to user
    await this.notifyUser(prescription, 'PRESCRIPTION_REJECTED');
  }

  private async handlePrescriptionDispensed(prescription: Prescription): Promise<void> {
    // Send notification to user
    await this.notifyUser(prescription, 'PRESCRIPTION_DISPENSED');
  }

  private async handlePrescriptionCancelled(prescription: Prescription): Promise<void> {
    // Send notification to user
    await this.notifyUser(prescription, 'PRESCRIPTION_CANCELLED');
  }

  private async notifyPharmacy(prescription: Prescription): Promise<void> {
    try {
      await axios.post(`${config.services.notifications}/send`, {
        type: 'PHARMACY_NOTIFICATION',
        template: 'NEW_PRESCRIPTION',
        data: {
          prescriptionId: prescription.id,
          pharmacyId: prescription.pharmacyId,
          userId: prescription.userId
        }
      });
    } catch (error) {
      logger.error('Failed to notify pharmacy:', error);
      // Don't throw error for notifications
    }
  }

  private async notifyUser(prescription: Prescription, template: string): Promise<void> {
    try {
      await axios.post(`${config.services.notifications}/send`, {
        userId: prescription.userId,
        type: 'USER_NOTIFICATION',
        template,
        data: {
          prescriptionId: prescription.id,
          pharmacyId: prescription.pharmacyId
        }
      });
    } catch (error) {
      logger.error('Failed to notify user:', error);
      // Don't throw error for notifications
    }
  }
} 