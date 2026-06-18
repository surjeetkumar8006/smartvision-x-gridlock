const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartvision_x';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('⚡ Connected to MongoDB Atlas successfully.');
        return true;
    } catch (err) {
        console.warn('⚠️ MongoDB not accessible. Switching to local JSON fallback mode. Error:', err.message);
        return false;
    }
};

module.exports = connectDB;
