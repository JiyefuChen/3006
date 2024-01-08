const Movie = require("../../models/Movie");
const Screening = require("../../models/Screening");
const {SeatStatus} = require("../../utils");
const router = require('express').Router();

const padStartZero = (number, length) => {
    return String(number).padStart(length, '0');
};
router.get('/', async (req, res) => {
    try {
        const screenings = await Screening.find();
        res.render("admin/screening/view", {screenings});
    } catch (error) {
        console.error('Error fetching screenings:', error);
        res.status(500).send('Internal Server Error');
    }
})
router.get("/view/:movieId", async (req, res) => {
    const movieId = req.params.movieId;
    let movie = null
    try {
        movie = await Movie.findById(movieId);
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).send('Internal Server Error');
    }
    const screenings = await Screening.find({movie_id: movieId});
    res.render("admin/screening/view", {screenings, movieId, showAdd:true});
})
router.post("/add/:movieId", async (req, res) => {
    const {start_time, seats_num, price} = req.body;
    let seats = []
    for (let i = 1; i <= seats_num; i++) {
        seats.push({id: padStartZero(i, 3), 'status': SeatStatus.None})
    }
    const movieId = req.params.movieId;
    try {
        const movie = await Movie.findById(movieId);
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).send('Internal Server Error');
    }
    Screening.create({
        movie_id: movieId,
        start_time,
        seats,
        price
    }).then(screening => {
        res.redirect(`/admin/screening/view/${movieId}`);
    }).catch(error => {
        console.error('Error creating screening:', error);
        res.status(500).send('Internal Server Error');
    })
})
router.get('/edit/:screeningId', async (req, res) => {
    const screeningId = req.params.screeningId;
    const screening = await Screening.findById(screeningId);
    if (!screening) {
        res.status(404).send('Screening not found');
        return;
    }
    res.render('admin/screening/edit', {screening});
})
router.post('/edit/:screeningId', async (req, res) => {
    const screeningId = req.params.screeningId;
    const {start_time, seats_num, price} = req.body;
    let seats = []
    for (let i = 1; i <= seats_num; i++) {
        seats.push({id: padStartZero(i, 3), 'status': SeatStatus.None})
    }
    Screening.findByIdAndUpdate(screeningId, {
        start_time,
        seats,
        price
    }).then(screening => {
        res.redirect(`/admin/screening/view/${screening.movie_id}`);
    }).catch(error => {
        console.error('Error updating screening:', error);
        res.status(500).send('Internal Server Error');
    })
})

router.get('/delete/:screeningId', async (req, res) => {
    const screeningId = req.params.screeningId;
    Screening.findByIdAndDelete(screeningId).then(screening => {
        res.redirect(`/admin/screening/view/${screening.movie_id}`);
    }).catch(error => {
        console.error('Error deleting screening:', error);
        res.status(500).send('Internal Server Error');
    })
})

module.exports = router;