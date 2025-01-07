import { google, youtube_v3 } from 'googleapis';
import fs from 'fs/promises';
import { VideoMetadata } from '../../types/social';
import { AppError } from '../../middleware/errorHandler';

export class YouTubeService {
  private youtube: youtube_v3.Youtube;

  constructor(private accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: this.accessToken });
    this.youtube = google.youtube({ version: 'v3', auth });
  }

  async uploadVideo(filepath: string, metadata: VideoMetadata): Promise<string> {
    try {
      const videoBuffer = await fs.readFile(filepath);

      const response = await this.youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags,
            categoryId: '22'
          },
          status: {
            privacyStatus: metadata.privacyStatus || 'private',
            selfDeclaredMadeForKids: false
          }
        },
        media: {
          body: videoBuffer
        }
      });

      return response.data.id!;
    } catch (error:any) {
      throw new AppError(500, `YouTube upload failed: ${error.message}`);
    }
  }
}