var createError = require('http-errors');
var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

var logger = require('morgan');
const connectDB = require('./db');


const Movie = require('./models/Movie');
const User = require('./models/User');
const Screening = require('./models/Screening');
const Seat = require('./models/Seat');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/auth');
var movieRouter = require('./routes/movie');
var screeningRouter = require('./routes/screening');
var seatRouter = require('./routes/seat');
var authRouter = require('./routes/auth');
var orderRouter = require('./routes/order');
var adminRouter = require('./routes/admin');

var app = express();

connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'abcd12345',
    resave: false,
    saveUninitialized: true,
}));

// Router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movie', movieRouter);
app.use('/screening', screeningRouter);
app.use('/seat', seatRouter);
app.use('/auth', authRouter);
app.use('/order', orderRouter);
app.use('/admin', adminRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
