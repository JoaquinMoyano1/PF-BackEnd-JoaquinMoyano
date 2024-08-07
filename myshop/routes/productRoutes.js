

const express = require('express');
const router = express.Router();
const generateMockProducts = require('../utils/mockingProducts');

// Endpoint para generar productos falsos
router.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

module.exports = router;
