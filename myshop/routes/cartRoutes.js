const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated, isAdmin, isUser } = require('./authMiddleware');

router.post('/:cid/products/:pid', isUser, cartController.addProductToCart);
router.delete('/:cid/products/:pid', isUser, cartController.removeProductFromCart);
router.put('/:cid', isUser, cartController.updateCart);
router.put('/:cid/products/:pid', isUser, cartController.updateProductQuantity);
router.delete('/:cid', isUser, cartController.clearCart);
router.get('/:cid', isAuthenticated, cartController.getCart);
router.post('/:cid/purchase', isUser, cartController.purchaseCart);

module.exports = router;
