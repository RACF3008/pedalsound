import mongoose from 'mongoose';

import { app } from './app';

const start = async () => { 
    // Revisar que la llave para el JWT existe en las variables de entorno
    if (!process.env.JWT_KEY) {
        throw new Error('Falta la llave para el JWT');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('Falta la URI de MongoDB');
    }
    // Intentar la conexión a MongoDb
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión a MongoDB exitosa!');
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Conectado al puerto 3000');
    });
};

start();