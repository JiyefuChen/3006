var express = require('express');
const Movie = require("../models/Movie");
const Screening = require("../models/Screening");
const Order = require("../models/Order");

const authRouter = require("./admin/auth");
const movieRouter = require("./admin/movie");
const screeningRouter = require("./admin/screening");
const orderRouter = require("./admin/order");
const Admin = require("../models/Admin");
var router = express.Router();
const authMiddleware = (req, res, next) => {
    console.log(req.session.userId)
    if (typeof req.session.userId === 'undefined') {
        return res.redirect('/admin/auth/login')
    } else if (Admin.findById(req.session.userId) == null) {
        return res.status(401).send('Unauthorized');
    } else {
        next();
    }
};

router.use(['/movie*', '/screening*', '/orders*', '/dashboard'], authMiddleware);

router.use('/auth', authRouter)
router.use('/movie', movieRouter)
router.use('/screening', screeningRouter)
router.use('/orders', orderRouter)

router.get('/dashboard', async (req, res, next) => {
    const movies = await Movie.find()
    const screenings = await Screening.find()
    const orders = await Order.find()
    res.render('admin/dashboard', {movies, screenings, orders});
});

router.get('/',async (req, res, next) => {
    res.redirect('/admin/dashboard')
})


module.exports = router;
