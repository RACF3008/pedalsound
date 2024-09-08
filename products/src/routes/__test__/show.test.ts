import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns a 404 if the product does not exist', async () => {
    // Crear un ID valido (que siga un patron de mongo)
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/products/${id}`)
        .send()
        .expect(404);
});

it('returns the ticket if the ticket is found', async () => {
    const title = 'test title';
    const price = 10;

    const response = await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({
            title, price
        })
        .expect(201);

    const productResponse = await request(app)
        .get(`/api/products/${response.body.id}`)
        .send()
        .expect(200);

    expect(productResponse.body.title).toEqual(title);
    expect(productResponse.body.price).toEqual(price);
});