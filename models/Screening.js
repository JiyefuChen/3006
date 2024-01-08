const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
    movie_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Movie'},
    start_time: Date,
    seats: [{type: Object}],
    price: Number
});


screeningSchema.virtual('formattedDate').get(function () {
    return this.start_time.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
});
const Screening = mongoose.model('Screening', screeningSchema);

module.exports = Screening;
