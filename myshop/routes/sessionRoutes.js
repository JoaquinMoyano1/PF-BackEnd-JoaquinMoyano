const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const { verifyToken } = require('../config/jwt');
const router = express.Router();

router.get('/current', verifyToken, userController.currentUser);

module.exports = router;
