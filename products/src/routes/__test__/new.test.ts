import request from 'supertest';
import { app } from '../../app';

import { Product } from '../../models/product';

it('has a route handler listening to /api/products for post requests', async () => {
    const response = await request(app)
        .post('/api/products')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only create new products if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/products')
        .send({});

    expect(response.status).toEqual(401);
});

it('returns other status than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400);
    
    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({
            price: 10
        })
        .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({
            title: 'test title',
            price: -10
        })
        .expect(400);

    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({
            title: 'test title'
        })
        .expect(400);
});

it('creates a product with valid parameters', async () => {
    // Obtener todos los productos en la base de datos y asegurarse
    // de que hay 0
    let products = await Product.find({});
    expect(products.length).toEqual(0);

    const title = 'test title';

    // Crear un producto
    await request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({
            title: title,
            price: 10
        })
        .expect(201);

    // Verificar que hay un solo producto
    products = await Product.find({});
    expect(products.length).toEqual(1);
    expect(products[0].title).toEqual(title);
    expect(products[0].price).toEqual(10);
});