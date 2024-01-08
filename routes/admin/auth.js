const Admin = require("../../models/Admin");
const {compare} = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await Admin.findOne({username});
        if (!user) {
            return res.status(401).render('admin/login', {err_message: 'Invalid username or password.'});
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
        res.status(200).render('admin/login')
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;