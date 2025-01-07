import { Router } from 'express';
import { upload, UploadController } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';

const router = Router();
const uploadController = new UploadController();

router.post(
  '/video',
  authenticate,
  upload.single('video'),
  uploadController.uploadVideo
);

export default router;