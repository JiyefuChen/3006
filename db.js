const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = 'mongodb://127.0.0.1:27017/movie';
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectDB;
