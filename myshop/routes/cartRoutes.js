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

router.post('/:cid/products/:pid', isAuthenticated, cartController.addProductToCart);
router.delete('/:cid/products/:pid', isAuthenticated, cartController.removeProductFromCart);
router.put('/:cid', isAuthenticated, cartController.updateCart);
router.put('/:cid/products/:pid', isAuthenticated, cartController.updateProductQuantity);
router.delete('/:cid', isAuthenticated, cartController.clearCart);
router.get('/:cid', isAuthenticated, cartController.getCart);

module.exports = router;
