import { Request, Response, NextFunction } from 'express';
import { MedicineService } from '../services/medicineService';
import { logger } from '../utils/logger';

const medicineService = new MedicineService();

export class MedicineController {
  async createMedicine(req: Request, res: Response, next: NextFunction) {
    try {
      const medicine = await medicineService.createMedicine(req.body);
      
      logger.info('Medicine created successfully');
      res.status(201).json(medicine);
    } catch (error) {
      next(error);
    }
  }

  async updateMedicine(req: Request, res: Response, next: NextFunction) {
    try {
      const { medicineId } = req.params;
      const medicine = await medicineService.updateMedicine(medicineId, req.body);
      
      logger.info('Medicine updated successfully');
      res.json(medicine);
    } catch (error) {
      next(error);
    }
  }

  async getMedicine(req: Request, res: Response, next: NextFunction) {
    try {
      const { medicineId } = req.params;
      const medicine = await medicineService.getMedicine(medicineId);
      
      logger.info('Medicine retrieved successfully');
      res.json(medicine);
    } catch (error) {
      next(error);
    }
  }

  async listMedicines(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await medicineService.listMedicines(page, limit);
      
      logger.info('Medicines listed successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteMedicine(req: Request, res: Response, next: NextFunction) {
    try {
      const { medicineId } = req.params;
      await medicineService.deleteMedicine(medicineId);
      
      logger.info('Medicine deleted successfully');
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async addMedicineToPharmacy(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId, medicineId } = req.params;
      const pharmacyMedicine = await medicineService.addMedicineToPharmacy({
        pharmacyId,
        medicineId,
        ...req.body
      });
      
      logger.info('Medicine added to pharmacy successfully');
      res.status(201).json(pharmacyMedicine);
    } catch (error) {
      next(error);
    }
  }

  async updatePharmacyMedicine(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId, medicineId } = req.params;
      const pharmacyMedicine = await medicineService.updatePharmacyMedicine(
        pharmacyId,
        medicineId,
        req.body
      );
      
      logger.info('Pharmacy medicine updated successfully');
      res.json(pharmacyMedicine);
    } catch (error) {
      next(error);
    }
  }

  async removeMedicineFromPharmacy(req: Request, res: Response, next: NextFunction) {
    try {
      const { pharmacyId, medicineId } = req.params;
      await medicineService.removeMedicineFromPharmacy(pharmacyId, medicineId);
      
      logger.info('Medicine removed from pharmacy successfully');
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async searchMedicines(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await medicineService.searchMedicines(query as string, page, limit);
      
      logger.info('Medicines searched successfully');
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
} 