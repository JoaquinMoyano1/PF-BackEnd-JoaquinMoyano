const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../config/jwt');

exports.register = (req, res) => {
    res.render('register');
};

exports.login = (req, res) => {
    res.render('login');
};

exports.profile = (req, res) => {
    res.render('profile', { user: req.user });
};

exports.logout = (req, res) => {
    req.logout();
    res.clearCookie('token');
    res.redirect('/login');
};

exports.authenticate = (req, res, next) => {
    passport.authenticate('local-login', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({ message: info.message });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            const token = generateToken(user);
            res.cookie('token', token, { httpOnly: true });
            return res.json({ user, token });
        });
    })(req, res, next);
};

exports.currentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ user: req.user });
};
