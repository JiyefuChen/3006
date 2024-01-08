const Movie = require("../../models/Movie");
const router = require('express').Router();


router.get('/view', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render('admin/movie/view', {movies});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/add', (req, res) => {
    const {title, description, release_date, duration, genre, imageUrl} = req.body;
    Movie.create({
        title,
        description,
        release_date,
        duration,
        genre,
        imageUrl
    }).then((movie) => {
        res.redirect('/admin/movie/view');
    }).catch((error) => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    });
});

router.get('/edit/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    const movie = Movie.findById(movieId);
    movie.then((movie) => {
        res.render('admin/movie/edit', {movie});
    }).catch((error) => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    });
});

router.post('/edit/:movieId', (req, res) => {
    const {title, description, release_date, duration, genre, imageUrl} = req.body;
    Movie.findByIdAndUpdate(req.params.movieId, {
        title,
        description,
        release_date,
        duration,
        genre,
        imageUrl
    }).then((movie) => {
        res.redirect('/admin/movie/view');
    }).catch((error) => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    });
})


router.get('/delete/:movieId', (req, res) => {
    Movie.findByIdAndDelete(req.params.movieId).then((movie) => {
        res.redirect('/admin/movie/view');
    }).catch((error) => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    });
})

module.exports = router;