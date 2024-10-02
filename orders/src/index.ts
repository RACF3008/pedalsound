import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { ProductCreatedListener } from './events/listeners/product-created-listener';
import { ProductUpdatedListener } from './events/listeners/product-updated-listener';

const start = async () => { 
    // Revisar que la llave para el JWT existe en las variables de entorno
    if (!process.env.JWT_KEY) {
        throw new Error('Falta la llave para el JWT');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('Falta la URI de MongoDB');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('Falta la ID del cliente de NATS');
    }
    if (!process.env.NATS_URL) {
        throw new Error('Falta la URL del servicio de NATS');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('Falta el ID del cluster de NATS');
    }
    // Intentar la conexión a MongoDb
    await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
        console.log('Conexión a NATS finalizada');
        process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ProductCreatedListener(natsWrapper.client).listen();
    new ProductUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión a MongoDB exitosa!');

    app.listen(3000, () => {
        console.log('Conectado al puerto 3000');
    });
};

start();