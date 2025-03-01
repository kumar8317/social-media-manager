import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs/promises';
import { AppError } from '../../middleware/errorHandler';

export class InstagramService {
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(private accessToken: string) {}

  async refreshToken(): Promise<string> {
    const response = await axios.get(`${this.baseUrl}/refresh_access_token`, {
      params: {
        access_token: this.accessToken,
        grant_type: 'ig_refresh_token'
      }
    });
    return response.data.access_token;
  }

  async publishReel(filepath: string, caption: string): Promise<string> {
    try {
      const container = await this.createContainer(filepath, caption);
      await this.uploadVideo(filepath, container.upload_url);
      return await this.publishContainer(container.id);
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