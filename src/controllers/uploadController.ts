import { Request, Response } from 'express';
import multer from 'multer';
import { StorageService } from '../services/storageService';
import { AppError } from '@/middleware/errorHandler';

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      cb(new Error('Only video files are allowed'));
      return;
    }
    cb(null, true);
  }
});

const storageService = new StorageService();

export class UploadController {
  async uploadVideo(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError(400, 'No video file provided');
      }

      const filepath = await storageService.uploadVideo(req.file);
      res.status(201).json({ filepath });
    } catch (error:any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}