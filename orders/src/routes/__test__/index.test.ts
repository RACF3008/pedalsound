import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Order } from "../../models/order";
import { Product } from "../../models/product";

const buildProduct = async () => {
    const product = Product.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test product',
        price: 10
    });
    await product.save();

    return product;
}

it('fetches orders for a particular user', async () => {
    // Crear 3 productos
    const productOne = await buildProduct();
    const productTwo = await buildProduct();
    const productThree = await buildProduct();

    // Crear dos usuarios distintos
    const userOne = global.signin();
    const userTwo = global.signin();

    // Crear una orden como Usuario #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ productId: productOne.id })
        .expect(201);

    // Crear dos ordenes como Usuario #2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ productId: productTwo.id })
        .expect(201);
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ productId: productThree.id })
        .expect(201);

    // Hacer una consulta para obtener las ordenes del usuario #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    // Asegurar que solo se muestran las ordenes del usuario #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[0].product.id).toEqual(productTwo.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[1].product.id).toEqual(productThree.id);
});