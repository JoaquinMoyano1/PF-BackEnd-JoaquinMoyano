const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    reference: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'premium'], default: 'user' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    documents: [documentSchema], // Nuevo array para documentos
    last_connection: { type: Date } // Nueva propiedad para la última conexión
});

const User = mongoose.model('User', userSchema);

module.exports = User;
