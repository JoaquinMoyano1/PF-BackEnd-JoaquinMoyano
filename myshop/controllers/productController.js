const { createCustomError } = require('../middleware/errorHandler');
const Product = require('../models/product');
const User = require('../models/user'); // Importar el modelo User
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Endpoint para generar productos mock
const generateMockProducts = (req, res) => {
    const products = Array.from({ length: 100 }).map(() => ({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        image: faker.image.imageUrl(),
        stock: faker.random.number({ min: 0, max: 100 })
    }));

    logger.info('Mock products generated successfully');
    res.status(200).json(products);
};

// Crear un nuevo producto
const createProduct = async (req, res, next) => {
    const { name, price, description, category, image, stock } = req.body;
    const user = req.session.userId;
  
    if (!name || !price) {
        const error = createCustomError('PRODUCT_CREATION_ERROR', 'Missing required fields: name or price');
        logger.warning('Product creation failed: Missing name or price');
        return next(error);
    }

    try {
        const owner = req.session.role === 'premium' ? user : 'admin'; // Asignar owner según el rol
        const newProduct = new Product({ name, price, description, category, image, stock, owner });
        await newProduct.save();
        logger.info(`Product created successfully: ${newProduct.name}`);
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
        logger.error(`Error creating product: ${err.message}`);
        next(err);
    }
};

// Agregar un producto al carrito
const addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.session.userId;

    if (!productId || !quantity) {
        const error = createCustomError('ADD_TO_CART_ERROR', 'Missing required fields: productId or quantity');
        logger.warning('Add to cart failed: Missing productId or quantity');
        return next(error);
    }

    try {
        const product = await Product.findById(productId);
        
        // Verifica si el producto pertenece al usuario premium
        if (product.owner && product.owner.equals(userId)) {
            const error = createCustomError('ADD_TO_CART_ERROR', 'You cannot add your own product to the cart');
            logger.warning(`User ${userId} tried to add their own product to the cart`);
            return next(error);
        }

        // Aquí iría la lógica para agregar el producto al carrito
        logger.info(`Product added to cart: productId=${productId}, quantity=${quantity}`);
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (err) {
        logger.error(`Error adding product to cart: ${err.message}`);
        next(err);
    }
};

// Función para eliminar un producto
const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await User.findById(product.owner); // Encuentra el usuario propietario
        if (user && user.role === 'premium') {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Producto eliminado',
                text: `El producto ${product.name} ha sido eliminado.`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error(`Error sending email: ${error}`);
                    return res.status(500).json({ message: 'Error sending email' });
                }
                logger.info('Email sent: ' + info.response);
            });
        }

        await Product.findByIdAndDelete(pid);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting product: ${error.message}`);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

module.exports = {
    generateMockProducts,
    createProduct,
    addToCart,
    deleteProduct // Exportar la nueva función
};
