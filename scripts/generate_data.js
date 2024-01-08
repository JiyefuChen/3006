// generateTestData.js

const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Screening = require('../models/Screening');
const Seat = require('../models/Seat');

const connectDB = require('../db');
const Admin = require("../models/Admin");
const {hash} = require("bcrypt");
const Order = require("../models/Order");
connectDB();
const padStartZero = (number, length) => {
    return String(number).padStart(length, '0');
};
let seats = []
for (let i = 1; i <= 100; i++) {
    seats.push({id: padStartZero(i, 3), 'status': 0})
}
const testData = async () => {
    try {
        // Clear existing data
        await Movie.deleteMany({});
        await Screening.deleteMany({});
        await Seat.deleteMany({});
        await Order.deleteMany({});

        // Insert movies
        const movie1 = await Movie.create({
            title: 'Inception',
            description: 'A mind-bending science fiction film.',
            release_date: new Date('2010-07-16'),
            duration: 148,
            genre: 'Sci-Fi',
            imageUrl: 'https://via.placeholder.com/300',
        });

        const movie2 = await Movie.create({
            title: 'The Shawshank Redemption',
            description: 'A classic drama film.',
            release_date: new Date('1994-09-23'),
            duration: 142,
            genre: 'Drama',
            imageUrl: 'https://via.placeholder.com/300',
        });

        // Insert screenings for movie1
        const screening1Movie1 = await Screening.create({
            movie_id: movie1._id,
            start_time: new Date('2024-01-10T18:00:00'),
            seats: seats,
            price: 10,
        });

        const screening2Movie1 = await Screening.create({
            movie_id: movie1._id,
            start_time: new Date('2024-01-10T20:30:00'),
            seats: seats,
            price: 10,
        });

        // Insert screenings for movie2
        const screening1Movie2 = await Screening.create({
            movie_id: movie2._id,
            start_time: new Date('2024-01-11T17:45:00'),
            seats: seats,
            price: 12,
        });

        const screening2Movie2 = await Screening.create({
            movie_id: movie2._id,
            start_time: new Date('2024-01-11T20:00:00'),
            seats: seats,
            price: 12,
        });
        const pwd = await hash('123456', 10);
        const admin = await Admin.create({
            username: 'admin',
            password: pwd,
            email: '',
            full_name: '',
        });

        console.log('Test data inserted successfully.');
    } catch (error) {
        console.error('Error inserting test data:', error);
    } finally {
        mongoose.connection.close();
        console.log('Disconnected from MongoDB.');
    }
};

testData();
