const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    screening_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Screening'},
    seats: [String],
    total_amount: Number,
    status: Number,
    order_date: {type: Date, default: Date.now},
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});

orderSchema.virtual('formattedDate').get(function () {
    return this.order_date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
