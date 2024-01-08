var express = require('express');
const Movie = require("../models/Movie");
const Screening = require("../models/Screening");
const Seat = require("../models/Seat");
const {SeatStatus, OrderStatus} = require("../utils");
const User = require("../models/User");
const Order = require("../models/Order");
var router = express.Router();

router.get('/detail/:screeningId', async (req, res) => {
    try {
        if (typeof req.session.userId === 'undefined') {
            return res.status(401).redirect(`/auth/login?redirect=${req.originalUrl}`);
        }
        const screeningId = req.params.screeningId;
        const screening = await Screening.findById(screeningId)
            .populate('movie_id');
        const seats = screening.seats
        res.render('seats', {screening, seats});
    } catch (error) {
        console.error('Error fetching available seats:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/reserve', async (req, res) => {
    try {
        if (typeof req.session.userId === 'undefined') {
            return res.status(401).json({message: 'Please login and try a again.'});
        }
        const user_id = req.session.userId;
        const {screening_id, seat_numbers} = req.body;
        const screen = await Screening.findById(screening_id);
        const seats = screen.seats;
        const seats_id = seats.map(v => v.id)
        const seats_status = seats.map(v => v.status)
        for (const seatNumber of seat_numbers) {
            const seat_ix = seats_id.indexOf(seatNumber);
            if (seat_ix < 0 || seats_status[seat_ix] !== SeatStatus.None) {
                return res.status(404).json({message: 'Seat not found or already reserved.'});
            }
            seats[seat_ix].status = SeatStatus.Buying
        }
        await Screening.findByIdAndUpdate(screening_id, {$set: {seats: seats}});
        const seat_cnt = seat_numbers.length
        total_amount = seat_cnt * screen.price
        const newOrder = new Order({
            user_id,
            screening_id,
            seats: seat_numbers,
            status: OrderStatus.Waiting,
            total_amount,
        });
        await newOrder.save()

        res.status(200).json({
            message: 'Seat reserved successfully.',
            order_id: newOrder._id
        });
    } catch (error) {
        console.error('Error reserving seat:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;