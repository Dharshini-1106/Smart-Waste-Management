
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecobin';
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

