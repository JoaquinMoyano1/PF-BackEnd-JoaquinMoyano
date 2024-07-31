const Cart = require('../models/cart');

class CartDAO {
    async findById(id) {
        return await Cart.findById(id).populate('products.product');
    }
    async save(cart) {
        return await cart.save();
    }
    // Métodos adicionales según sea necesario
}

module.exports = new CartDAO();
