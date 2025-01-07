import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { authenticate } from '../middleware/auth';
import { validatePost } from '../middleware/validation';

const router = Router();
const postController = new PostController();

router.post('/', authenticate, validatePost, postController.createPost);
router.get('/', authenticate, postController.getPosts);
router.post('/:id/publish', authenticate, postController.publishPost);

export default router;