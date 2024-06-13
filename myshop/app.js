require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.render('products', { products });
});

app.get('/carts/:cid', async (req, res) => {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    res.render('cart', { cart });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
