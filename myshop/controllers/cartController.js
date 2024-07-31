const CartRepository = require('../repositories/cartRepository');
const ProductRepository = require('../repositories/productRepository');
const TicketService = require('../services/ticketService');

exports.purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartRepository.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        
        let totalAmount = 0;
        let failedProducts = [];
        
        for (let item of cart.products) {
            const product = await ProductRepository.getProductById(item.product._id);
            if (product.available && product.stock >= item.quantity) {
                product.stock -= item.quantity;
                totalAmount += product.price * item.quantity;
                await ProductRepository.saveProduct(product);
            } else {
                failedProducts.push(item.product._id);
            }
        }
        
        const ticket = await TicketService.createTicket({
            amount: totalAmount,
            purchaser: req.user.email
        });
        
        cart.products = cart.products.filter(item => failedProducts.includes(item.product._id));
        await CartRepository.saveCart(cart);
        
        res.json({ status: 'success', ticket, failedProducts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
