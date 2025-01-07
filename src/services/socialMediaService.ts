import { SocialAccount, ISocialAccount } from '../models/socialAccount';

export class SocialMediaService {
  async linkAccount(
    userId: string,
    platform: 'INSTAGRAM' | 'YOUTUBE',
    accessToken: string,
    refreshToken: string,
    expiresAt: Date
  ): Promise<ISocialAccount> {
    const socialAccount = new SocialAccount({
      userId,
      platform,
      accessToken,
      refreshToken,
      expiresAt
    });

    return socialAccount.save();
  }

  async getAccounts(userId: string): Promise<ISocialAccount[]> {
    return SocialAccount.find({ userId });
  }
}