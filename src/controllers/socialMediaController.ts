import { Request, Response } from 'express';
import { SocialMediaService } from '../services/socialMediaService';
import { AppError } from '../middleware/errorHandler';

export class SocialMediaController {
  private socialMediaService: SocialMediaService;

  constructor() {
    this.socialMediaService = new SocialMediaService();
  }

  async getAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const { platform } = req.params;
      const userId = req.user.userId;
      
      const authUrl = await this.socialMediaService.getAuthUrl(platform, userId);
      res.json({ authUrl });
    } catch (error:any) {
      throw new AppError(400, error.message);
    }
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { platform } = req.params;
      const { code } = req.query;
      const userId = req.user.userId;

      await this.socialMediaService.handleCallback(platform, code as string, userId);
      res.redirect('/dashboard'); // Redirect to frontend dashboard
    } catch (error:any) {
      throw new AppError(400, error.message);
    }
  }

  async getAccounts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const accounts = await this.socialMediaService.getAccounts(userId);
      res.json(accounts);
    } catch (error:any) {
      throw new AppError(400, error.message);
    }
  }
}