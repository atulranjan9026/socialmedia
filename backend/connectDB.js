const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
