const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
}

/**
 * @swagger
 * /cart/{cid}/products/{pid}:
 *   post:
 *     summary: Agregar un producto al carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto agregado al carrito
 *       401:
 *         description: No autenticado
 */
router.post('/:cid/products/:pid', isAuthenticated, cartController.addProductToCart);

/**
 * @swagger
 * /cart/{cid}/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       401:
 *         description: No autenticado
 */
router.delete('/:cid/products/:pid', isAuthenticated, cartController.removeProductFromCart);

/**
 * @swagger
 * /cart/{cid}:
 *   put:
 *     summary: Actualizar el carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito actualizado
 *       401:
 *         description: No autenticado
 */
router.put('/:cid', isAuthenticated, cartController.updateCart);

/**
 * @swagger
 * /cart/{cid}/products/{pid}:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cantidad del producto actualizada
 *       401:
 *         description: No autenticado
 */
router.put('/:cid/products/:pid', isAuthenticated, cartController.updateProductQuantity);

/**
 * @swagger
 * /cart/{cid}:
 *   delete:
 *     summary: Limpiar el carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito limpiado
 *       401:
 *         description: No autenticado
 */
router.delete('/:cid', isAuthenticated, cartController.clearCart);

/**
 * @swagger
 * /cart/{cid}:
 *   get:
 *     summary: Obtener el carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito obtenido
 *       401:
 *         description: No autenticado
 */
router.get('/:cid', isAuthenticated, cartController.getCart);

module.exports = router;
