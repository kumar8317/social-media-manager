import { Router } from 'express';
import { SocialMediaController } from '../controllers/socialMediaController';
import { authenticate } from '../middleware/auth';

const router = Router();
const socialMediaController = new SocialMediaController();

router.get('/auth/:platform', authenticate, socialMediaController.getAuthUrl);
router.get('/auth/callback/:platform', authenticate, socialMediaController.handleCallback);
router.get('/accounts', authenticate, socialMediaController.getAccounts);

export default router;