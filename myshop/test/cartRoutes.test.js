const request = require('supertest');
const app = require('../app');
const Cart = require('../models/cart'); // Suponiendo que tienes un modelo de Cart

describe('Cart Routes', () => {
  beforeEach(async () => {
    // Limpiar la colección de carritos antes de cada test
    await Cart.deleteMany({});
  });

  it('should add a product to the cart', async () => {
    const response = await request(app)
      .post('/cart')
      .send({
        productId: 'someProductId',
        quantity: 2
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Product added to cart successfully');
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/cart')
      .send({ quantity: 2 });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error').that.includes('Missing required fields: productId or quantity');
  });

  // Agrega más pruebas para las funcionalidades del carrito
});
