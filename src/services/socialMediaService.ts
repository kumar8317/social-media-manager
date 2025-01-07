import { SocialAccount } from '../models/socialAccount';
import { InstagramAuthService } from './auth/instagramAuth';
import { YoutubeAuthService } from './auth/youtubeAuth';

export class SocialMediaService {
  private instagramAuth: InstagramAuthService;
  private youtubeAuth: YoutubeAuthService;

  constructor() {
    this.instagramAuth = new InstagramAuthService();
    this.youtubeAuth = new YoutubeAuthService();
  }

  async getAuthUrl(platform: string, userId: string): Promise<string> {
    switch (platform.toUpperCase()) {
      case 'INSTAGRAM':
        return this.instagramAuth.getAuthUrl(userId);
      case 'YOUTUBE':
        return this.youtubeAuth.getAuthUrl(userId);
      default:
        throw new Error('Invalid platform');
    }
  }

  async handleCallback(platform: string, code: string, userId: string): Promise<void> {
    let tokens;
    
    switch (platform.toUpperCase()) {
      case 'INSTAGRAM':
        tokens = await this.instagramAuth.handleCallback(code);
        break;
      case 'YOUTUBE':
        tokens = await this.youtubeAuth.handleCallback(code);
        break;
      default:
        throw new Error('Invalid platform');
    }

    await SocialAccount.create({
      userId,
      platform: platform.toUpperCase(),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt
    });
  }

  async getAccounts(userId: string) {
    return SocialAccount.find({ userId });
  }
}