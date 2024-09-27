const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userRoutes = require('./userRoutes'); // Importar las rutas de usuarios

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Ruta para recuperación de contraseña
router.post('/forgot-password', authController.forgotPassword);

// Ruta para restablecer contraseña (con el token que se envía por correo)
router.post('/reset-password/:token', authController.resetPassword);

// Usar las rutas de usuarios
router.use('/users', userRoutes); // Agregar el prefijo /users para las rutas de usuarios

module.exports = router;
