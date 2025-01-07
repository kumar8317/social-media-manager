import Bull from 'bull';
import { StorageService } from './storageService';
import { InstagramService } from './integrations/instagramService';
import { YouTubeService } from './integrations/youtubeService';
import { SocialAccount } from '../models/socialAccount';
import { Post } from '../models/post';
import { AppError } from '../middleware/errorHandler';

export class SocialMediaPublisher {
  private publishQueue: Bull.Queue;
  private storageService: StorageService;

  constructor() {
    this.publishQueue = new Bull('social-media-publishing');
    this.storageService = new StorageService();
    this.initializeQueue();
  }

  private initializeQueue() {
    this.publishQueue.process(async (job) => {
      await this.publishPost(job.data.postId);
    });

    this.publishQueue.on('failed', async (job, error) => {
      const post = await Post.findById(job.data.postId);
      if (post) {
        post.status = 'FAILED';
        await post.save();
      }
      console.error(`Failed to publish post ${job.data.postId}:`, error);
    });
  }

  async schedulePost(postId: string, scheduledTime: Date): Promise<void> {
    await this.publishQueue.add(
      { postId },
      { 
        delay: scheduledTime.getTime() - Date.now(),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000 // 1 minute
        }
      }
    );
  }

  async publishPost(postId: string): Promise<void> {
    const post = await Post.findById(postId);
    if (!post) throw new AppError(404, 'Post not found');

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

      // Clean up local file after successful publishing
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