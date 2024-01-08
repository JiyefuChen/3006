const Movie = require("../../models/Movie");
const Screening = require("../../models/Screening");
const {SeatStatus, OrderStatusLabel} = require("../../utils");
const Order = require("../../models/Order");
const router = require('express').Router();

const padStartZero = (number, length) => {
    return String(number).padStart(length, '0');
};
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user_id')
            .populate({path: 'screening_id', populate: {path: 'movie_id'}});
        res.render("admin/orders/view", {orders, OrderStatusLabel});
    } catch (error) {
        console.error('Error fetching screenings:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/detail/:orderId', async (req, res) => {
    try {
        if (typeof req.session.userId === 'undefined') {
            return res.status(401).redirect(`/admin/auth/login?redirect=${req.originalUrl}`);
        }
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId)
            .populate('user_id')
            .populate({path: 'screening_id', populate: {path: 'movie_id'}});
        if (!order) {
            return res.status(404).json({message: 'Order not found.'});
        }
        res.render('admin/orders/detail', {order, OrderStatusLabel});
    } catch (error) {
        console.error('Error retrieving order details:', error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;