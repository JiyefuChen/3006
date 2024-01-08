var express = require('express');
const Order = require("../models/Order");
const {OrderStatus, OrderStatusLabel} = require("../utils");
var router = express.Router();


router.get('/detail/:orderId', async (req, res) => {
    try {
        if (typeof req.session.userId === 'undefined') {
            return res.status(401).redirect(`/auth/login?redirect=${req.originalUrl}`);
        }
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId)
            .populate('user_id')
            .populate({path: 'screening_id', populate: {path: 'movie_id'}});
        if (!order || order.user_id._id.toString() !== req.session.userId) {
            return res.status(404).json({message: 'Order not found.'});
        }
        res.render('order/detail', {order, OrderStatusLabel});
    } catch (error) {
        console.error('Error retrieving order details:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/pay/:orderId', async (req, res) => {
    try {
        if (typeof req.session.userId === 'undefined') {
            return res.status(401).redirect(`/auth/login?redirect=${req.originalUrl}`);
        }
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order || order.user_id.toString() !== req.session.userId) {
            return res.status(404).json({message: 'Order not found.'});
        }
        order.status = OrderStatus.Payed;
        order.save()
        res.status(200).json({message: 'Pay order successfully.'})
    } catch (error) {
        console.error('Error retrieving order details:', error);
        res.status(500).send('Internal Server Error');
    }
})


router.get('/all', async (req, res) => {
    try {
        if (typeof req.session.userId === 'undefined') {
            return res.status(401).redirect(`/auth/login?redirect=${req.originalUrl}`);
        }
        const user_id = req.session.userId;
        const orders = await Order.find({user_id})
            .populate({path: 'user_id', select: 'username'})
            .populate({path: 'screening_id', select: 'start_time', populate: {path: 'movie_id', select: 'title'}})
        res.status(200).render('order/all', {orders, OrderStatusLabel})
    } catch (error) {
        console.error('Error retrieving order details:', error);
        res.status(500).send('Internal Server Error');
    }
})


module.exports = router;