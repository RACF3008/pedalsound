import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

declare global {
    var signin: () => string[];
};

let mongo: any;

// Esto se ejecuta antes de todos los tests
beforeAll(async () => {
    process.env.JWT_KEY = 'testkey';

    mongo =  await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

// Entre cada test se borra toda la base de datos
beforeEach(async () => {
    const collections:any = await mongoose.connection.db?.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = () => {
    // Construir un payload JWT. 
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };

    // Crear el JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Construir el objeto de sesión { jwt: MY_JWT }
    const session = { jwt: token };

    // Convertir la sesion a JSON
    const sessionJSON = JSON.stringify(session);

    // Tomar el JSON y convertirlo a base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Retornar la cookie con la info encriptada
    return [`session=${base64}`];
};