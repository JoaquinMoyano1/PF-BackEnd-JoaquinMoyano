const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    available: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Referencia al creador (owner)
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

