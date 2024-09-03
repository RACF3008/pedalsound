import mongoose from 'mongoose';

import { app } from './app';

const start = async () => { 
    // Revisar que la llave para el JWT existe en las variables de entorno
    if (!process.env.JWT_KEY) {
        throw new Error('Falta la llave para el JWT');
    }
    // Intentar la conexión a MongoDb
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('Conexión a MongoDB exitosa!');
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Conectado al puerto 3000');
    });
};

start();