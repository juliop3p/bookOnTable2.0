import jwt from 'jsonwebtoken';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../src/app';
import Admin from '../src/app/models/Admin';

const token = jwt.sign({ id: '1' }, process.env.SECRET);

beforeAll(async () => {
  await Admin.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('PostController', () => {
  it('should be able to create a new user', async () => {
    const response = await request(app)
      .post('/admins')
      .send({
        name: 'Julio Cesar',
        email: 'julio@gmail.com',
        password: '123456',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('id');
  });

  it('should be able to list users', async () => {
    const response = await request(app)
      .get('/admins')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body[0]).toHaveProperty('_id');
  });
});
