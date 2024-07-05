const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/register', userController.register);
router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/login', userController.login);
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
router.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

router.get('/profile', isAuthenticated, userController.profile);
router.get('/logout', userController.logout);

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
