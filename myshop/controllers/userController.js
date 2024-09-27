const User = require('../models/user');
const nodemailer = require('nodemailer');

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'email role last_connection'); // Solo devuelve los campos necesarios
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Eliminar usuarios inactivos
const deleteInactiveUsers = async (req, res) => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Fecha de hace 2 días
    try {
        const inactiveUsers = await User.find({ last_connection: { $lt: twoDaysAgo } });

        await User.deleteMany({ last_connection: { $lt: twoDaysAgo } }); // Eliminar usuarios inactivos

        // Enviar correos de notificación
        inactiveUsers.forEach(user => {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Cuenta eliminada por inactividad',
                text: 'Tu cuenta ha sido eliminada debido a 2 días de inactividad.'
            };
            transporter.sendMail(mailOptions);
        });

        res.status(200).json({ message: 'Usuarios inactivos eliminados' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuarios' });
    }
};

// Subir documentos
const uploadDocuments = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const documents = req.files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));

        user.documents.push(...documents);
        user.last_connection = new Date(); // Actualiza la última conexión
        await user.save();

        res.status(200).json({ message: 'Documentos subidos exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al subir documentos' });
    }
};

module.exports = {
    changeUserRole,
    getAllUsers,
    deleteInactiveUsers,
    uploadDocuments
};
