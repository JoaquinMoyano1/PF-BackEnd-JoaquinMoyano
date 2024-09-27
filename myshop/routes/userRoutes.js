const express = require('express');
const { changeUserRole, getAllUsers, deleteInactiveUsers, uploadDocuments } = require('../controllers/userController');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = './uploads/documents';
        if (file.fieldname === 'profileImage') {
            dir = './uploads/profiles';
        } else if (file.fieldname === 'productImage') {
            dir = './uploads/products';
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo con timestamp
    }
});

const upload = multer({ storage });

// Rutas
router.get('/', getAllUsers); // Obtener todos los usuarios
router.delete('/', deleteInactiveUsers); // Eliminar usuarios inactivos
router.post('/:uid/documents', upload.array('documents', 10), uploadDocuments); // Subir documentos

// Cambiar rol de usuario
router.put('/premium/:uid', changeUserRole);

module.exports = router;
