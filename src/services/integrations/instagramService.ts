import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs/promises';
import { AppError } from '../../middleware/errorHandler';

export class InstagramService {
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(private accessToken: string) {}

  async publishReel(filepath: string, caption: string): Promise<string> {
    try {
      // 1. Create container
      const container = await this.createContainer(filepath, caption);

      // 2. Upload video
      await this.uploadVideo(filepath, container.upload_url);

      // 3. Publish container
      const mediaId = await this.publishContainer(container.id);

      return mediaId;
    } catch (error:any) {
      throw new AppError(500, `Instagram publish failed: ${error.message}`);
    }
  }

  private async createContainer(filepath: string, caption: string) {
    const response = await axios.post(`${this.baseUrl}/me/media`, {
      media_type: 'REELS',
      video_url: filepath,
      caption,
      access_token: this.accessToken
    });
    return response.data;
  }

  private async uploadVideo(filepath: string, uploadUrl: string) {
    const videoBuffer = await fs.readFile(filepath);
    const form = new FormData();
    form.append('video', videoBuffer);

    await axios.post(uploadUrl, form, {
      headers: form.getHeaders()
    });
  }

  private async publishContainer(containerId: string) {
    const response = await axios.post(`${this.baseUrl}/${containerId}`, {
      access_token: this.accessToken
    });
    return response.data.id;
  }
}