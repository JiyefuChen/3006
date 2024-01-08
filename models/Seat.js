const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    screening_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Screening'},
    seat_number: String,
    status: String
});

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
