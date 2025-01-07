import { StorageService } from './storageService';
import { InstagramService } from './integrations/instagramService';
import { YouTubeService } from './integrations/youtubeService';
import { SocialAccount } from '../models/socialAccount';
import { Post } from '../models/post';
import { AppError } from '../middleware/errorHandler';

export class SocialMediaPublisher {
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  async publishPost(postId: string): Promise<void> {
    const post = await Post.findById(postId)
      .populate('userId')
      .exec();

    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    try {
      const accounts = await SocialAccount.find({
        userId: post.userId,
        platform: { $in: post.platforms }
      });

      await Promise.all(post.platforms.map(async platform => {
        const account = accounts.find(acc => acc.platform === platform);
        if (!account) throw new AppError(400, `No ${platform} account linked`);

        if (platform === 'INSTAGRAM') {
          const instagram = new InstagramService(account.accessToken);
          await instagram.publishReel(post.videoUrl, post.description || '');
        } else if (platform === 'YOUTUBE') {
          const youtube = new YouTubeService(account.accessToken);
          await youtube.uploadVideo(post.videoUrl, {
            title: post.title || 'Untitled',
            description: post.description || '',
            tags: [],
            privacyStatus: 'public'
          });
        }
      }));

      // Delete local video file after publishing
      await this.storageService.deleteVideo(post.videoUrl);
      
      post.status = 'PUBLISHED';
      await post.save();
    } catch (error) {
      post.status = 'FAILED';
      await post.save();
      throw error;
    }
  }
}
