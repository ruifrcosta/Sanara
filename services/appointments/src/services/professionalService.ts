import { PrismaClient, Professional, Availability } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateProfessionalData {
  name: string;
  email: string;
  speciality: string;
  crm: string;
  availability?: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
  }>;
}

export interface UpdateProfessionalData {
  name?: string;
  email?: string;
  speciality?: string;
  crm?: string;
}

export interface UpdateAvailabilityData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

export class ProfessionalService {
  async createProfessional(data: CreateProfessionalData) {
    try {
      const professional = await prisma.professional.create({
        data: {
          name: data.name,
          email: data.email,
          speciality: data.speciality,
          crm: data.crm,
          availability: data.availability ? {
            create: data.availability
          } : undefined
        },
        include: {
          availability: true
        }
      });

      logger.info('Professional created successfully', { professionalId: professional.id });
      return professional;
    } catch (error) {
      logger.error('Failed to create professional:', error);
      throw new AppError(400, 'Failed to create professional');
    }
  }

  async updateProfessional(professionalId: string, data: UpdateProfessionalData) {
    try {
      const professional = await prisma.professional.update({
        where: { id: professionalId },
        data,
        include: {
          availability: true
        }
      });

      logger.info('Professional updated successfully', { professionalId });
      return professional;
    } catch (error) {
      logger.error('Failed to update professional:', error);
      throw new AppError(400, 'Failed to update professional');
    }
  }

  async getProfessional(professionalId: string) {
    try {
      const professional = await prisma.professional.findUnique({
        where: { id: professionalId },
        include: {
          availability: true
        }
      });

      if (!professional) {
        throw new AppError(404, 'Professional not found');
      }

      return professional;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get professional:', error);
      throw new AppError(500, 'Failed to get professional');
    }
  }

  async listProfessionals(speciality?: string) {
    try {
      const professionals = await prisma.professional.findMany({
        where: {
          speciality: speciality ? speciality : undefined
        },
        include: {
          availability: true
        }
      });

      return professionals;
    } catch (error) {
      logger.error('Failed to list professionals:', error);
      throw new AppError(500, 'Failed to list professionals');
    }
  }

  async updateAvailability(professionalId: string, availabilityData: UpdateAvailabilityData[]) {
    try {
      // Delete existing availability
      await prisma.availability.deleteMany({
        where: { professionalId }
      });

      // Create new availability
      const professional = await prisma.professional.update({
        where: { id: professionalId },
        data: {
          availability: {
            create: availabilityData
          }
        },
        include: {
          availability: true
        }
      });

      logger.info('Professional availability updated successfully', { professionalId });
      return professional;
    } catch (error) {
      logger.error('Failed to update professional availability:', error);
      throw new AppError(400, 'Failed to update professional availability');
    }
  }

  async getAvailableSlots(professionalId: string, date: Date) {
    try {
      const professional = await prisma.professional.findUnique({
        where: { id: professionalId },
        include: {
          availability: true,
          appointments: {
            where: {
              startTime: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(24, 0, 0, 0))
              },
              status: { in: ['SCHEDULED', 'CONFIRMED'] }
            }
          }
        }
      });

      if (!professional) {
        throw new AppError(404, 'Professional not found');
      }

      const dayOfWeek = date.getDay();
      const dayAvailability = professional.availability.find(a => a.dayOfWeek === dayOfWeek);

      if (!dayAvailability) {
        return [];
      }

      // Generate all possible slots
      const slots = this.generateTimeSlots(
        dayAvailability.startTime,
        dayAvailability.endTime,
        dayAvailability.slotDuration
      );

      // Filter out booked slots
      const bookedSlots = professional.appointments.map(appointment => ({
        start: appointment.startTime,
        end: appointment.endTime
      }));

      return slots.filter(slot => !this.isSlotBooked(slot, bookedSlots));
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get available slots:', error);
      throw new AppError(500, 'Failed to get available slots');
    }
  }

  private generateTimeSlots(startTime: string, endTime: string, duration: number) {
    const slots: Date[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    let current = start;
    while (current < end) {
      slots.push(new Date(current));
      current = new Date(current.getTime() + duration * 60000);
    }

    return slots;
  }

  private isSlotBooked(slot: Date, bookedSlots: Array<{ start: Date; end: Date }>) {
    const slotEnd = new Date(slot.getTime() + 30 * 60000); // Assuming 30-minute slots
    return bookedSlots.some(booking =>
      (slot >= booking.start && slot < booking.end) ||
      (slotEnd > booking.start && slotEnd <= booking.end)
    );
  }
} 