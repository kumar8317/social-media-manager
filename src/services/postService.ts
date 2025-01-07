import { Post, IPost } from '../models/post';
import Bull from 'bull';

const postQueue = new Bull('post-publishing');

export class PostService {
  async createPost(
    userId: string,
    videoUrl: string,
    platforms: ('INSTAGRAM' | 'YOUTUBE')[],
    title?: string,
    description?: string,
    scheduledTime?: Date
  ): Promise<IPost> {
    const post = new Post({
      userId,
      videoUrl,
      platforms,
      title,
      description,
      scheduledTime,
      status: scheduledTime ? 'SCHEDULED' : 'DRAFT'
    });

    await post.save();

    if (scheduledTime) {
      await postQueue.add(
        'publish-post',
        { postId: post._id },
        { delay: scheduledTime.getTime() - Date.now() }
      );
    }

    return post;
  }

  async publishPost(postId: string): Promise<IPost> {
    const post = await Post.findByIdAndUpdate(
      postId,
      { status: 'PUBLISHED' },
      { new: true }
    );
    
    if (!post) throw new Error('Post not found');
    return post;
  }
}