import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Product } from "../../models/product";

it('fetches the order', async () => {
    // Crear un producto
    const product = Product.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        price: 10
    });
    await product.save();

    // Crear un usuario
    const user = global.signin();

    // Realizar una consulta para formular una orden con este producto
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ productId: product.id })
        .expect(201);
    console.log(order);

    // Hacer una solicitud para obtener la orden
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('user should not be able to fetch another users order', async () => {
    // Crear un producto
    const product = Product.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        price: 10
    });
    await product.save();

    // Crear dos usuarios
    const userOne = global.signin();
    const userTwo = global.signin();

    // Realizar una consulta para formular una orden con este producto
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ productId: product.id })
        .expect(201);

    // Hacer una solicitud para obtener la orden
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', userTwo)
        .send()
        .expect(401);
});