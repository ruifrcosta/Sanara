import { PrismaClient, Pharmacy, PharmacyStatus, Address, OperatingHours } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config';
import axios from 'axios';

const prisma = new PrismaClient();

export interface CreatePharmacyData {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  operatingHours: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }>;
}

export interface UpdatePharmacyData {
  name?: string;
  email?: string;
  phone?: string;
  status?: PharmacyStatus;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  operatingHours?: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }>;
}

export class PharmacyService {
  async createPharmacy(data: CreatePharmacyData): Promise<Pharmacy> {
    try {
      // Validate unique fields
      await this.validateUniqueFields(data.cnpj, data.email);

      // Get coordinates if geocoding is enabled
      let coordinates = null;
      if (config.geocoding.enabled) {
        coordinates = await this.getCoordinates(data.address);
      }

      // Create pharmacy with all related data
      const pharmacy = await prisma.pharmacy.create({
        data: {
          name: data.name,
          cnpj: data.cnpj,
          email: data.email,
          phone: data.phone,
          status: PharmacyStatus.PENDING,
          address: {
            create: {
              ...data.address,
              latitude: coordinates?.latitude,
              longitude: coordinates?.longitude
            }
          },
          operatingHours: {
            create: data.operatingHours
          }
        },
        include: {
          address: true,
          operatingHours: true
        }
      });

      logger.info('Pharmacy created successfully', { pharmacyId: pharmacy.id });
      return pharmacy;
    } catch (error) {
      logger.error('Failed to create pharmacy:', error);
      throw error;
    }
  }

  async updatePharmacy(pharmacyId: string, data: UpdatePharmacyData): Promise<Pharmacy> {
    try {
      const pharmacy = await this.getPharmacy(pharmacyId);

      // Get coordinates if address is being updated and geocoding is enabled
      let coordinates = null;
      if (data.address && config.geocoding.enabled) {
        coordinates = await this.getCoordinates({
          ...pharmacy.address!,
          ...data.address
        });
      }

      // Update pharmacy and related data
      const updatedPharmacy = await prisma.pharmacy.update({
        where: { id: pharmacyId },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          address: data.address ? {
            update: {
              ...data.address,
              latitude: coordinates?.latitude,
              longitude: coordinates?.longitude
            }
          } : undefined,
          operatingHours: data.operatingHours ? {
            deleteMany: {},
            create: data.operatingHours
          } : undefined
        },
        include: {
          address: true,
          operatingHours: true
        }
      });

      logger.info('Pharmacy updated successfully', { pharmacyId });
      return updatedPharmacy;
    } catch (error) {
      logger.error('Failed to update pharmacy:', error);
      throw error;
    }
  }

  async getPharmacy(pharmacyId: string): Promise<Pharmacy & { address: Address | null; operatingHours: OperatingHours[] }> {
    try {
      const pharmacy = await prisma.pharmacy.findUnique({
        where: { id: pharmacyId },
        include: {
          address: true,
          operatingHours: true
        }
      });

      if (!pharmacy) {
        throw new AppError(404, 'Pharmacy not found');
      }

      return pharmacy;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to get pharmacy:', error);
      throw new AppError(500, 'Failed to get pharmacy');
    }
  }

  async listPharmacies(
    page: number = 1,
    limit: number = config.pagination.defaultLimit,
    filters?: {
      status?: PharmacyStatus;
      city?: string;
      state?: string;
    }
  ): Promise<{ pharmacies: Pharmacy[]; total: number }> {
    try {
      const where = {
        status: filters?.status,
        address: {
          city: filters?.city,
          state: filters?.state
        }
      };

      const [pharmacies, total] = await Promise.all([
        prisma.pharmacy.findMany({
          where,
          include: {
            address: true,
            operatingHours: true
          },
          orderBy: { name: 'asc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.pharmacy.count({ where })
      ]);

      return { pharmacies, total };
    } catch (error) {
      logger.error('Failed to list pharmacies:', error);
      throw new AppError(500, 'Failed to list pharmacies');
    }
  }

  async searchNearbyPharmacies(
    latitude: number,
    longitude: number,
    radius: number = 5, // km
    page: number = 1,
    limit: number = config.pagination.defaultLimit
  ): Promise<{ pharmacies: Pharmacy[]; total: number }> {
    try {
      // Using Haversine formula in SQL
      const pharmacies = await prisma.$queryRaw`
        SELECT p.*, 
          (6371 * acos(cos(radians(${latitude})) 
          * cos(radians(a.latitude)) 
          * cos(radians(a.longitude) - radians(${longitude})) 
          + sin(radians(${latitude})) 
          * sin(radians(a.latitude)))) AS distance
        FROM pharmacies p
        JOIN addresses a ON p.id = a.pharmacy_id
        WHERE p.status = 'ACTIVE'
        HAVING distance <= ${radius}
        ORDER BY distance
        LIMIT ${limit}
        OFFSET ${(page - 1) * limit}
      `;

      const total = await prisma.$queryRaw`
        SELECT COUNT(*)
        FROM pharmacies p
        JOIN addresses a ON p.id = a.pharmacy_id
        WHERE p.status = 'ACTIVE'
        AND (6371 * acos(cos(radians(${latitude})) 
          * cos(radians(a.latitude)) 
          * cos(radians(a.longitude) - radians(${longitude})) 
          + sin(radians(${latitude})) 
          * sin(radians(a.latitude)))) <= ${radius}
      `;

      return { pharmacies, total: Number(total[0].count) };
    } catch (error) {
      logger.error('Failed to search nearby pharmacies:', error);
      throw new AppError(500, 'Failed to search nearby pharmacies');
    }
  }

  private async validateUniqueFields(cnpj: string, email: string): Promise<void> {
    const existingPharmacy = await prisma.pharmacy.findFirst({
      where: {
        OR: [
          { cnpj },
          { email }
        ]
      }
    });

    if (existingPharmacy) {
      if (existingPharmacy.cnpj === cnpj) {
        throw new AppError(400, 'CNPJ already registered');
      }
      if (existingPharmacy.email === email) {
        throw new AppError(400, 'Email already registered');
      }
    }
  }

  private async getCoordinates(address: {
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
  }): Promise<{ latitude: number; longitude: number } | null> {
    if (!config.geocoding.apiKey) {
      return null;
    }

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: `${address.street}, ${address.number}, ${address.city}, ${address.state}, ${address.country}`,
          key: config.geocoding.apiKey
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng
        };
      }

      return null;
    } catch (error) {
      logger.error('Failed to get coordinates:', error);
      return null;
    }
  }
} 