const express = require('express');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); // Importar faker para generar datos mock
const { createCustomError, errorDictionary } = require('./errorHandler'); // Importar el manejador de errores

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/your-db-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Mocking endpoint
app.get('/mockingproducts', (req, res) => {
  const products = Array.from({ length: 100 }).map(() => ({
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    image: faker.image.imageUrl(),
    stock: faker.random.number({ min: 0, max: 100 })
  }));

  res.status(200).json(products);
});

// Example product creation endpoint with error handling
app.post('/products', (req, res, next) => {
  const { name, price, description, category, image, stock } = req.body;
  
  if (!name || !price) {
    const error = createCustomError('PRODUCT_CREATION_ERROR', 'Missing required fields: name or price');
    return next(error);
  }

  // Aquí iría la lógica para crear el producto en la base de datos

  res.status(201).json({ message: 'Product created successfully' });
});

// Example add to cart endpoint with error handling
app.post('/cart', (req, res, next) => {
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity) {
    const error = createCustomError('ADD_TO_CART_ERROR', 'Missing required fields: productId or quantity');
    return next(error);
  }

  // Aquí iría la lógica para agregar el producto al carrito

  res.status(200).json({ message: 'Product added to cart successfully' });
});

// Global error handler
app.use((err, req, res, next) => {
  const errorResponse = errorDictionary[err.code] || {
    status: 500,
    message: 'Internal Server Error'
  };

  res.status(errorResponse.status).json({ error: errorResponse.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
