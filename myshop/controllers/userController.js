const User = require('../models/user');
const passport = require('passport');

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
    res.redirect('/login');
};


exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};
