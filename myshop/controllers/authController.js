const User = require('../models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico
        pass: process.env.EMAIL_PASS  // Tu contraseña de correo
    }
});

// Registro de usuario
exports.register = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.redirect('/login');
};

// Inicio de sesión
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.role = user.role;
        user.last_connection = new Date(); // Actualizar last_connection
        await user.save();
        res.redirect('/products');
    } else {
        res.redirect('/login');
    }
};

// Cierre de sesión
exports.logout = async (req, res) => {
    const user = await User.findById(req.session.userId);
    if (user) {
        user.last_connection = new Date(); // Actualizar last_connection
        await user.save();
    }
    
    req.session.destroy();
    res.redirect('/login');
};

// Recuperación de contraseña - Envío de enlace
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 3600000; // 1 hora

    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperación de contraseña',
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
               <a href="${resetLink}">Restablecer contraseña</a>
               <p>El enlace expira en 1 hora.</p>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error enviando el correo' });
        }
        res.status(200).json({ message: 'Correo de restablecimiento enviado' });
    });
};

// Restablecimiento de contraseña
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ 
        resetPasswordToken: token, 
        resetPasswordExpires: { $gt: Date.now() } // Verifica si el token no ha expirado
    });

    if (!user) {
        return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    if (await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ message: 'No puedes usar la misma contraseña anterior' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
};
