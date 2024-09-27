const request = require('supertest');
const app = require('../app'); // Asegúrate de que exportas tu app de Express
const Product = require('../models/product');

describe('Product Routes', () => {
  beforeEach(async () => {
    // Limpiar la colección antes de cada test
    await Product.deleteMany({});
  });

  it('should create a new product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        name: 'Test Product',
        price: 10.99,
        description: 'A product for testing',
        category: 'Test',
        image: 'http://example.com/image.jpg',
        stock: 50
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('message', 'Product created successfully');
    expect(response.body.product).to.have.property('name', 'Test Product');
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/products')
      .send({ price: 10.99 });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error').that.includes('Missing required fields: name or price');
  });

  it('should retrieve all products', async () => {
    await Product.create({ name: 'Product 1', price: 10 });
    await Product.create({ name: 'Product 2', price: 20 });

    const response = await request(app).get('/products');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array').that.has.lengthOf(2);
  });
});
