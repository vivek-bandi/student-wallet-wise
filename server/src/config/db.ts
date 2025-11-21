import mongoose from 'mongoose';
import { ENV } from './env';

export async function connectDB() {
  if (!ENV.MONGODB_URI) {
    console.warn('[DB] MONGODB_URI not set. Starting server without DB connection.');
    return;
  }
  await mongoose.connect(ENV.MONGODB_URI);
  console.log('[DB] Connected to MongoDB');
}
