import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import socialMediaRoutes from './routes/socialMediaRoutes';
import postRoutes from './routes/postRoutes';
import { errorHandler } from './middleware/errorHandler';
import uploadRoutes from './routes/uploadRoutes';

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use('/api/auth', authRoutes);
app.use('/api/social', socialMediaRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});