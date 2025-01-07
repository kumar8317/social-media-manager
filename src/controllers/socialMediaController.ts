import { Request, Response } from 'express';
import { SocialMediaService } from '../services/socialMediaService';

const socialMediaService = new SocialMediaService();

export class SocialMediaController {
  async linkAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const { platform } = req.params;
      const { accessToken, refreshToken, expiresAt } = req.body;

      const account = await socialMediaService.linkAccount(
        userId,
        platform as 'INSTAGRAM' | 'YOUTUBE',
        accessToken,
        refreshToken,
        new Date(expiresAt)
      );

      res.status(201).json(account);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAccounts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const accounts = await socialMediaService.getAccounts(userId);
      res.json(accounts);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }
}