import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  // MongoDB Duplicate Key Error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    res.status(400).json({
      status: 'error',
      message: 'Duplicate entry found'
    });
    return;
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
    return;
  }

  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};