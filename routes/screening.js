var express = require('express');
const Movie = require("../models/Movie");
const Screening = require("../models/Screening");
const {SeatStatus} = require("../utils");
var router = express.Router();

router.get('/detail/:movieId', async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const movie = await Movie.findById(movieId);
        let screenings = await Screening.find({movie_id: movieId});
        for (let i = 0; i < screenings.length; i++) {
            screenings[i].available_seats = screenings[i].seats.filter(seat => seat.status === SeatStatus.None).length;
        }
        res.render('screenings', {movie, screenings});
    } catch (error) {
        console.error('Error fetching movie screenings:', error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;