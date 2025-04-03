const request = require('supertest');
const app = require('../server');

describe('POST /login', () => {
    it('debería devolver 200 para credenciales válidas', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: 'admin', password: 'admin123' });
        expect(res.statusCode).toEqual(200);
    });

    it('debería devolver 400 para credenciales inválidas', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: '', password: '' });
        expect(res.statusCode).toEqual(400);
    });
});
