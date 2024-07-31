const CartDAO = require('./daos/cartDAO');

class CartRepository {
    async getCartById(id) {
        return await CartDAO.findById(id);
    }
    async saveCart(cart) {
        return await CartDAO.save(cart);
    }
    // Métodos adicionales según sea necesario
}

module.exports = new CartRepository();
