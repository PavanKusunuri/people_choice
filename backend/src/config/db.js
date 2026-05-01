import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Enable Mongoose query logging in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
        logger.debug(`Mongoose: ${collectionName}.${methodName}(${JSON.stringify(methodArgs)})`);
      });
    }

    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
