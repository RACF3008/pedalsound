import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { ProductUpdatedListener } from "../product-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product";
import { ProductUpdatedEvent } from "@racf-pedalsound/common";

const setup = async () => {
    // Crear una instancia de un listener
    const listener = new ProductUpdatedListener(natsWrapper.client);

    // Crear y guardar un nuevo producto
    const product = Product.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title', 
        price: 10
    });
    await product.save();

    // Crear un objeto información de prueba
    const data: ProductUpdatedEvent['data'] = {
        id: product.id,
        version: product.version + 1,
        title: 'test title 2',
        price: 20,
        userId: 'fakeUserId'
    };

    // Crear un objecto tipo mensaje de prueba
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, product };
};

it('finds, updates, and saves a product', async () => {
    const { listener, data, msg, product } = await setup();

    await listener.onMessage(data, msg);

    const updatedProduct = await Product.findById(product.id);

    expect(updatedProduct!.title).toEqual(data.title);
    expect(updatedProduct!.price).toEqual(data.price);
    expect(updatedProduct!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, data, msg } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
});