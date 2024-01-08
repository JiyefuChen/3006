const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    description: String,
    release_date: Date,
    duration: Number,
    genre: String,
    imageUrl: String
});

movieSchema.virtual('formattedDate').get(function () {
    return this.release_date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
});
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
