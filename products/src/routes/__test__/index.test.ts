import request from 'supertest';
import { app } from '../../app';

const createProduct = () => {
    return request(app)
        .post('/api/products')
        .set('Cookie', global.signin())
        .send({
            title: 'test title',
            price: 10
        })
        .expect(201);
}

it('can fetch a list of products', async () => {
    // Crear productos de prueba
    await createProduct();
    await createProduct();
    await createProduct();

    const response = await request(app)
        .get('/api/products')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});