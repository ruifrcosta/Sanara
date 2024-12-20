import { PrismaClient, Appointment } from '@prisma/client';
import { addHours, isAfter, isBefore, addDays } from 'date-fns';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config';
import { publishNotification } from '../queue/publisher';

const prisma = new PrismaClient();

export interface CreateAppointmentData {
  userId: string;
  professionalId: string;
  startTime: Date;
  type: 'VIDEO_CALL' | 'CHAT';
  notes?: string;
}

export interface UpdateAppointmentData {
  startTime?: Date;
  status?: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
}

export class AppointmentService {
  async createAppointment(data: CreateAppointmentData) {
    try {
      // Validate appointment time
      const now = new Date();
      const minStartTime = addHours(now, config.appointment.minAdvanceBooking);
      const maxStartTime = addDays(now, config.appointment.maxFutureBooking);

      if (isBefore(data.startTime, minStartTime)) {
        throw new AppError(400, `Appointments must be scheduled at least ${config.appointment.minAdvanceBooking} hour(s) in advance`);
      }

      if (isAfter(data.startTime, maxStartTime)) {
        throw new AppError(400, `Appointments cannot be scheduled more than ${config.appointment.maxFutureBooking} days in advance`);
      }

      // Check professional availability
      const professional = await prisma.professional.findUnique({
        where: { id: data.professionalId },
        include: { availability: true }
      });

      if (!professional) {
        throw new AppError(404, 'Professional not found');
      }

      // Calculate end time based on default duration
      const endTime = addMinutes(data.startTime, config.appointment.defaultDuration);

      // Check for conflicting appointments
      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          professionalId: data.professionalId,
          status: { in: ['SCHEDULED', 'CONFIRMED'] },
          OR: [
            {
              AND: [
                { startTime: { lte: data.startTime } },
                { endTime: { gt: data.startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } }
              ]
            }
          ]
        }
      });

      if (conflictingAppointment) {
        throw new AppError(400, 'This time slot is already booked');
      }

      // Create appointment
      const appointment = await prisma.appointment.create({
        data: {
          userId: data.userId,
          professionalId: data.professionalId,
          startTime: data.startTime,
          endTime,
          status: 'SCHEDULED',
          type: data.type,
          notes: data.notes
        },
        include: {
          professional: true
        }
      });

      // Schedule notifications
      await this.scheduleNotifications(appointment);

      logger.info('Appointment created successfully', { appointmentId: appointment.id });
      return appointment;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to create appointment:', error);
      throw new AppError(500, 'Failed to create appointment');
    }
  }

  async updateAppointment(appointmentId: string, data: UpdateAppointmentData) {
    try {
      const appointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          startTime: data.startTime,
          endTime: data.startTime ? addMinutes(data.startTime, config.appointment.defaultDuration) : undefined,
          status: data.status,
          notes: data.notes
        },
        include: {
          professional: true
        }
      });

      // If status changed to cancelled, notify relevant parties
      if (data.status === 'CANCELLED') {
        await publishNotification({
          appointmentId: appointment.id,
          userId: appointment.userId,
          type: 'CANCELLATION',
          scheduledFor: new Date()
        });
      }

      logger.info('Appointment updated successfully', { appointmentId });
      return appointment;
    } catch (error) {
      logger.error('Failed to update appointment:', error);
      throw new AppError(400, 'Failed to update appointment');
    }
  }

  async getAppointment(appointmentId: string) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          professional: true
        }
      });

      if (!appointment) {
        throw new AppError(404, 'Appointment not found');
      }

      return appointment;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get appointment:', error);
      throw new AppError(500, 'Failed to get appointment');
    }
  }

  async listUserAppointments(userId: string, status?: string) {
    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          userId,
          status: status ? status : undefined
        },
        include: {
          professional: true
        },
        orderBy: {
          startTime: 'asc'
        }
      });

      return appointments;
    } catch (error) {
      logger.error('Failed to list user appointments:', error);
      throw new AppError(500, 'Failed to list appointments');
    }
  }

  async listProfessionalAppointments(professionalId: string, status?: string) {
    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          professionalId,
          status: status ? status : undefined
        },
        include: {
          professional: true
        },
        orderBy: {
          startTime: 'asc'
        }
      });

      return appointments;
    } catch (error) {
      logger.error('Failed to list professional appointments:', error);
      throw new AppError(500, 'Failed to list appointments');
    }
  }

  private async scheduleNotifications(appointment: Appointment) {
    try {
      const notifications = config.appointment.reminderTimes.map(hours => ({
        appointmentId: appointment.id,
        userId: appointment.userId,
        type: 'REMINDER',
        scheduledFor: addHours(appointment.startTime, -hours),
        status: 'PENDING'
      }));

      // Add confirmation notification
      notifications.push({
        appointmentId: appointment.id,
        userId: appointment.userId,
        type: 'CONFIRMATION',
        scheduledFor: new Date(),
        status: 'PENDING'
      });

      // Publish notifications to queue
      await Promise.all(
        notifications.map(notification => publishNotification(notification))
      );
    } catch (error) {
      logger.error('Failed to schedule notifications:', error);
      // Don't throw error here, as the appointment was created successfully
    }
  }
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
} 