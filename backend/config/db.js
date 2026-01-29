const mongoose = require('mongoose');
const customLogger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s
    });

    customLogger.success('MongoDB connection established');
    customLogger.info(`MongoDB host: ${conn.connection.host}`);

    // Connection event handlers
    mongoose.connection.on('connected', () => {
      customLogger.database('MongoDB', 'connected');
    });

    mongoose.connection.on('error', (err) => {
      customLogger.error('MongoDB connection failed');
      customLogger.error(`Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      customLogger.warning('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      customLogger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    customLogger.error('MongoDB connection failed');
    customLogger.error(`Error: ${error.message}`);
    throw error; // Don't exit here, let the server handle it
  }
};

module.exports = connectDB;
