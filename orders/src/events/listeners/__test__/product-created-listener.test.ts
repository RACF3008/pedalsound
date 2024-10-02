import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { ProductCreatedEvent } from '@racf-pedalsound/common';
import { ProductCreatedListener } from '../product-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';

const setup = async () => {
    // Crear una instancia de un listener
    const listener = new ProductCreatedListener(natsWrapper.client);

    // Crear información de un evento de prueba
    const data: ProductCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // Crear un objecto tipo mensaje de prueba
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('creates and saves a product', async () => {
    const { listener, data, msg } = await setup();

    // Llamar a la función onMessage con el objeto de info + mensaje
    await listener.onMessage(data, msg);

    // Verificar que el producto se creo
    const product = await Product.findById(data.id);

    expect(product).toBeDefined();
    expect(product!.title).toEqual(data.title);
    expect(product!.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // Llamar a la función onMessage con el objeto de info + mensaje
    await listener.onMessage(data, msg);

    // Asegurar que la función ACK es llamada
    expect(msg.ack).toHaveBeenCalled();
});