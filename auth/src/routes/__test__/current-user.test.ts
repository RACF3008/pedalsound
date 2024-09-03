import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
    // Como supertest no maneja las cookies, hay que guardar la respuesta
    // al signupen una variable, en este caso authResponse, y despues 
    // extraer la cookie con authResponse.get('Set-Cookie'). Luego incluirla
    // dentro de la petición para obtener el usuario actual.
    const cookie: any = await global.signin();
        
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);
    
    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);
    
    expect(response.body.currentUser).toEqual(null);
});