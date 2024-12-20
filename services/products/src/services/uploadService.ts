import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError } from '../middlewares/errorHandler';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

export interface UploadResult {
  url: string;
  publicId: string;
}

export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<UploadResult> {
    try {
      // Convert file buffer to base64
      const base64File = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64File, {
        folder: config.cloudinary.folder,
        resource_type: 'auto'
      });

      logger.info('Image uploaded successfully', { publicId: result.public_id });

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      logger.error('Failed to upload image:', error);
      throw new AppError(500, 'Failed to upload image');
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.info('Image deleted successfully', { publicId });
    } catch (error) {
      logger.error('Failed to delete image:', error);
      throw new AppError(500, 'Failed to delete image');
    }
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<UploadResult[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      
      logger.info('Multiple images uploaded successfully', {
        count: files.length
      });

      return results;
    } catch (error) {
      logger.error('Failed to upload multiple images:', error);
      throw new AppError(500, 'Failed to upload multiple images');
    }
  }

  validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > config.upload.maxFileSize) {
      throw new AppError(400, 'File size exceeds the limit');
    }

    // Check mime type
    if (!config.upload.allowedMimeTypes.includes(file.mimetype)) {
      throw new AppError(400, 'Invalid file type');
    }
  }
} 