// app.js

const express = require('express');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { createCustomError } = require('./middleware/errorHandler');
const logger = require('./utils/logger'); // Importar el logger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express'); // Importar swagger-ui
const cors = require('cors'); // Importar CORS

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Habilitar CORS
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/your-db-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  logger.info('Connected to MongoDB'); // Usar el logger para conexión exitosa
}).catch(err => {
  logger.error('Error connecting to MongoDB', err); // Usar el logger para errores en la conexión
});

// Definir las opciones de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'MyShop API',
      version: '1.0.0',
      description: 'API para la gestión de productos y carritos en MyShop'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ]
  },
  apis: ['./routes/*.js'], // Ruta donde están tus rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Endpoint para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mocking endpoint
app.get('/mockingproducts', (req, res) => {
  const products = Array.from({ length: 100 }).map(() => ({
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    image: faker.image.imageUrl(),
    stock: faker.random.number({ min: 0, max: 100 }),
  }));

  logger.info('Mocking products generated');
  res.status(200).json(products);
});

// Endpoint para crear productos con manejo de errores
app.post('/products', (req, res, next) => {
  const { name, price, description, category, image, stock } = req.body;

  if (!name || !price) {
    const error = createCustomError('PRODUCT_CREATION_ERROR', 'Missing required fields: name or price');
    logger.warning('Product creation failed: missing name or price');
    return next(error);
  }

  // Aquí iría la lógica para crear el producto en la base de datos
  logger.info(`Product created: ${name}, price: ${price}`);
  res.status(201).json({ message: 'Product created successfully' });
});

// Endpoint para añadir productos al carrito con manejo de errores
app.post('/cart', (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    const error = createCustomError('ADD_TO_CART_ERROR', 'Missing required fields: productId or quantity');
    logger.warning('Add to cart failed: missing productId or quantity');
    return next(error);
  }

  // Aquí iría la lógica para agregar el producto al carrito
  logger.info(`Product added to cart: productId=${productId}, quantity=${quantity}`);
  res.status(200).json({ message: 'Product added to cart successfully' });
});

// Endpoint para probar los diferentes niveles de logs
app.get('/loggerTest', (req, res) => {
  logger.debug('Debug level log');
  logger.http('HTTP level log');
  logger.info('Info level log');
  logger.warning('Warning level log');
  logger.error('Error level log');
  logger.fatal('Fatal level log');

  res.send('Logs generados, revisa la consola y el archivo errors.log si corresponde.');
});

// Middleware de manejo global de errores
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`); // Usar el logger para registrar errores
  const errorResponse = errorDictionary[err.code] || {
    status: 500,
    message: 'Internal Server Error',
  };

  res.status(errorResponse.status).json({ error: errorResponse.message });
});

// Iniciar el servidor
app.listen(port, () => {
  logger.info(`Server running on port ${port}`); // Usar el logger para registrar que el servidor está en ejecución
});
