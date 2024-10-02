import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Product } from "../../models/product";
import { natsWrapper } from "../../nats-wrapper";

it('marks an order as cancelled', async () => {
    // Crear un producto
    const product = Product.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        price: 10
    });
    await product.save();

    const user = global.signin();

    // Crear una orden para dicho producto
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ productId: product.id })
        .expect(201);

    // Hacer una solicitud para cancelar la orden
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    // ASegurar que la orden fue cancelada
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
    const product = Product.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        price: 10
    });
    await product.save();

    const user = global.signin();

    // Crear una orden para dicho producto
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ productId: product.id })
        .expect(201);

    // Hacer una solicitud para cancelar la orden
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});