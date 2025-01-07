import { Request, Response } from 'express';
import { PostService } from '../services/postService';
import { Post } from '@/models/post';

const postService = new PostService();

export class PostController {
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const { videoUrl, platforms, title, description, scheduledTime } = req.body;

      const post = await postService.createPost(
        userId,
        videoUrl,
        platforms,
        title,
        description,
        scheduledTime ? new Date(scheduledTime) : undefined
      );

      res.status(201).json(post);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }

  async publishPost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = await postService.publishPost(id);
      res.json(post);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const posts = await Post.find({ userId }).sort({ createdAt: -1 });
      res.json(posts);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }
}
