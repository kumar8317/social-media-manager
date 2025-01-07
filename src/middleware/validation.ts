import { Request, Response, NextFunction } from 'express';

export const validateRegistration = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  next();
};

export const validateLogin = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  next();
};

export const validatePost = async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<void> => {
    const { videoUrl, platforms, title, description, scheduledTime } = req.body;
  
    if (!videoUrl) {
      res.status(400).json({ error: 'Video URL is required' });
      return;
    }
  
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      res.status(400).json({ error: 'At least one platform must be selected' });
      return;
    }
  
    const validPlatforms = ['INSTAGRAM', 'YOUTUBE'];
    const invalidPlatform = platforms.some(platform => !validPlatforms.includes(platform));
    if (invalidPlatform) {
      res.status(400).json({ error: 'Invalid platform selected' });
      return;
    }
  
    if (scheduledTime && new Date(scheduledTime) < new Date()) {
      res.status(400).json({ error: 'Scheduled time must be in the future' });
      return;
    }
  
    next();
  };