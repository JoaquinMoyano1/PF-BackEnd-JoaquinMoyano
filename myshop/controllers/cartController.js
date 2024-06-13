const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        const product = cart.products.find(p => p.product.toString() === pid);
        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({ product: pid });
        }
        await cart.save();
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = products;
        await cart.save();
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        const product = cart.products.find(p => p.product.toString() === pid);
        if (product) {
            product.quantity = quantity;
            await cart.save();
            res.json({ status: 'success', cart });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = [];
        await cart.save();
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
