const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('Auth Routes', () => {
  beforeEach(async () => {
    // Limpiar la colección de usuarios antes de cada test
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message').that.includes('registered');
  });

  it('should login a user', async () => {
    await User.create({
      email: 'test@example.com',
      password: 'password123'
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message').that.includes('logged in');
  });

  it('should return 401 on invalid login', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('error').that.includes('Invalid email or password');
  });
});
