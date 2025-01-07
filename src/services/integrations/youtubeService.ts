import { google } from 'googleapis';
import fs from 'fs/promises';
import { AppError } from '../../middleware/errorHandler';
import { VideoMetadata } from '@/types/social';

export class YouTubeService {
  private youtube;

  constructor(private accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
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
            tags: metadata.tags
          },
          status: {
            privacyStatus: metadata.privacyStatus || 'private'
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