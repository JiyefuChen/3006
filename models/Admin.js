const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    full_name: String,
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
