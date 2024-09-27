const express = require('express');
const router = express.Router();
const generateMockProducts = require('../utils/mockingProducts');

// Importar el modelo de Producto si tienes uno
const Product = require('../models/product');

/**
 * @swagger
 * /mockingproducts:
 *   get:
 *     summary: Genera productos falsos
 *     responses:
 *       200:
 *         description: Lista de productos generados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   price:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   image:
 *                     type: string
 *                   stock:
 *                     type: integer
 */
router.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/products', async (req, res) => {
    const products = await Product.find(); // Obtener todos los productos de la base de datos
    res.json(products);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post('/products', async (req, res) => {
    const { name, price, description, category, image, stock } = req.body;
    const newProduct = new Product({ name, price, description, category, image, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 */
router.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 */
router.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(updatedProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Producto eliminado exitosamente
 */
router.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(204).send(); // No content
});

module.exports = router;
