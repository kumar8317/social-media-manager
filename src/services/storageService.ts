import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler';

export class StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    const filename = `${uuidv4()}-${file.originalname}`;
    const filepath = path.join(this.uploadDir, filename);

    try {
      await fs.writeFile(filepath, file.buffer);
      return filepath;
    } catch (error) {
      throw new AppError(500, 'Video upload failed');
    }
  }

  async deleteVideo(filepath: string): Promise<void> {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  }
}
