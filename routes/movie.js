var express = require('express');
const Movie = require("../models/Movie");
var router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        const movies = await Movie.find();
        res.render('movie/index', {movies});
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/detail/:id', async function (req, res, next) {
    try {
        const movie = await Movie.findById(req.params.id);
        res.render('movie/detail', {movie});
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
