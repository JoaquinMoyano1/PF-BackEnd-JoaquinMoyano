const { createCustomError, errorDictionary } = require('./errorHandler');
const faker = require('@faker-js/faker');

// Simulación de un modelo de producto (usualmente esto vendría de un archivo de modelo de Mongoose)
const Product = require('./models/Product');

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

  res.status(200).json(products);
};

// Crear un nuevo producto
const createProduct = async (req, res, next) => {
  const { name, price, description, category, image, stock } = req.body;
  
  if (!name || !price) {
    const error = createCustomError('PRODUCT_CREATION_ERROR', 'Missing required fields: name or price');
    return next(error);
  }

  try {
    const newProduct = new Product({ name, price, description, category, image, stock });
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    next(err);
  }
};

// Agregar un producto al carrito
const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity) {
    const error = createCustomError('ADD_TO_CART_ERROR', 'Missing required fields: productId or quantity');
    return next(error);
  }

  try {
    // Aquí iría la lógica para agregar el producto al carrito
    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateMockProducts,
  createProduct,
  addToCart
};
