import request from "supertest";
import { app } from "../../app";

// Si el sign-up es exitoso, el servidor retornará un 201.
it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

// Si el email es invalido, retornar un error 400.
it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test.com',
            password: 'password'
        })
        .expect(400);
});

// Si el password es invalido, retornar un error 400.
it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'pas'
        })
        .expect(400);
});

// Si alguno de los dos campos está vacío, retornar un error 400.
it('returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: ''
        })
        .expect(400);
    await request(app)
        .post('/api/users/signup')
        .send({
            email: '',
            password: 'password'
        })
        .expect(400);
});

// Si el email ya existe, retornar un error 400.
it ('disallow duplicate emails', async () =>{
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

// Verificar la creacion de una cookie luego de un sign-up.
it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
        
    expect(response.get('Set-Cookie')).toBeDefined();
})