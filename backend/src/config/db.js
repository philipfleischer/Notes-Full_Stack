import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MONGODB CONNETED SUCCESSFULLY!');
  } catch (error) {
    console.log('Error conencting to MONGODB', error);
    process.exit(1); // Exit with failure
  }
};
