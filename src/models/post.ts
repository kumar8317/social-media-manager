import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    userId: mongoose.Types.ObjectId;
    platforms: ('INSTAGRAM' | 'YOUTUBE')[];
    videoUrl: string;
    title?: string;
    description?: string;
    scheduledTime?: Date;
    status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
    createdAt: Date;
    updatedAt: Date;
}
  
const postSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platforms: [{ type: String, enum: ['INSTAGRAM', 'YOUTUBE'] }],
    videoUrl: { type: String, required: true },
    title: String,
    description: String,
    scheduledTime: Date,
    status: { 
        type: String, 
        enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED'],
        default: 'DRAFT'
    }
}, { timestamps: true });

export const Post = mongoose.model<IPost>('Post', postSchema);