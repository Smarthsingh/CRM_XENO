const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // modern mongoose doesn’t need useNewUrlParser or useUnifiedTopology
      serverSelectionTimeoutMS: 5000,
      ssl: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
