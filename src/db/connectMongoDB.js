import mongoose from 'mongoose';
import Task from '../models/task.js';

const connectMongoDB = async () => {
  try {
    const url = process.env.MONGO_URL;
    await mongoose.connect(url);
    console.log('Successfuly connected');

    await Task.syncIndexes();
    console.log('Indexes synced successfully');
  } catch (error) {
    console.error('Failed to connect', error.message);
    process.exit(1);
  }
};

export default connectMongoDB;
