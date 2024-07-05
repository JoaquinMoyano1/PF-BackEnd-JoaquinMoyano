require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const Product = require('./models/product');
const User = require('./models/user');
const app = express();
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/auth', authRoutes);

app.get('/products', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const products = await Product.find();
    const user = await User.findById(req.session.userId);
    res.render('products', { products, user });
});

app.get('/carts/:cid', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    res.render('cart', { cart });
});

app.get('/login', (req, res) => {
    res.render('login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
