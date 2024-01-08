var express = require('express');
const User = require("../models/User");
const {hash, compare} = require("bcrypt");
var router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {username, password, email, full_name} = req.body;
        const existingUser = await User.findOne({$or: [{username}, {email}]});

        if (existingUser) {
            return res.status(409).json({message: 'Username or email already exists.'});
        }

        const hashedPassword = await hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            full_name,
        });

        await newUser.save();

        res.status(201).json({message: 'Registration successful.'});
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).render('auth/login', {err_message: 'Invalid username or password.'});
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid username or password.'});
        }
        req.session.userId = user._id;
        res.status(200).json({message: 'Login successful.', user: user, redirect: req.query.redirect});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json({message: 'Logout successful.'});
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json({message: 'Logout successful.'});
    });
});

router.get('/login', async (req, res) => {
    try {
        res.status(200).render('auth/login')
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/register', async (req, res) => {
    try {
        res.status(200).render('auth/register')
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;
