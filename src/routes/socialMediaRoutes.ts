import { Router } from 'express';
import { SocialMediaController } from '../controllers/socialMediaController';
import { authenticate } from '../middleware/auth';

const router = Router();
const socialMediaController = new SocialMediaController();

router.post('/link/:platform', authenticate, socialMediaController.linkAccount);
router.get('/accounts', authenticate, socialMediaController.getAccounts);

export default router;