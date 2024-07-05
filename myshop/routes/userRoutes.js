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
router.post('/login', userController.authenticate);

router.get('/profile', passport.authenticate('jwt', { session: false }), userController.profile);
router.get('/logout', userController.logout);

module.exports = router;
