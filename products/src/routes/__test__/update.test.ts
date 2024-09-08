import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the product id does not exist', async () => {
    // Crear un id valido
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/products/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'test title',
            price: 10
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    // Crear un id valido
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/products/${id}`)
        .send({
            title: 'test title',
            price: 10
        })
        .expect(401);
});

it('returns a 401 if the user does not own the product', async () => {
    const response = await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({
            title: 'test title',
            price: 10
        })
        .expect(201);

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: "updated title",
            price: 11
        })
        .expect(401);
});

it('returns a 400 if the new title or price is invalid', async () => {
    // Crear una cookie para crear el producto y luego intentar actualizarlo
    const cookie = global.signin();

    // Crear un nuevo producto
    const response = await request(app)
        .post('/api/products')
        .set('Cookie', cookie)
        .send({
            title: 'test title',
            price: 10
        })
        .expect(201);

    // Intentar actualizar el producto con un titulo invalido
    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: -10
        })
        .expect(400);
});

it('updates the product information successfully', async () => {
    // Crear una cookie para crear el producto y luego intentar actualizarlo
    const cookie = global.signin();

    // Crear un nuevo producto
    const response = await request(app)
        .post('/api/products')
        .set('Cookie', cookie)
        .send({
            title: 'test title',
            price: 10
        })
        .expect(201);

    // Actualizar el producto
    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 11
        })
        .expect(200);

    // Verificar que el producto se actualizo correctamente
    const productResponse = await request(app)
        .get(`/api/products/${response.body.id}`)
        .send()
        .expect(200);
    expect(productResponse.body.title).toEqual('new title');
    expect(productResponse.body.price).toEqual(11);
});