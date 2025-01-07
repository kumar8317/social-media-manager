import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialAccount extends Document {
    userId: mongoose.Types.ObjectId;
    platform: 'INSTAGRAM' | 'YOUTUBE';
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const socialAccountSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, enum: ['INSTAGRAM', 'YOUTUBE'], required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  }, { timestamps: true });
  
  socialAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });
  export const SocialAccount = mongoose.model<ISocialAccount>('SocialAccount', socialAccountSchema);