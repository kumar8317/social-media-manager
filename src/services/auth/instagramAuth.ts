import axios from 'axios';

export class InstagramAuthService {
  private clientId = process.env.INSTAGRAM_CLIENT_ID!;
  private clientSecret = process.env.INSTAGRAM_CLIENT_SECRET!;
  private redirectUri = process.env.INSTAGRAM_REDIRECT_URI!;

  getAuthUrl(userId: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'instagram_basic,instagram_content_publish',
      response_type: 'code',
      state: userId
    });

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  }

  async handleCallback(code: string) {
    const response = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
      code
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresAt: new Date(Date.now() + response.data.expires_in * 1000)
    };
  }
}