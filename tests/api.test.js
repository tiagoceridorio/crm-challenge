const request = require('supertest');
const app = require('./index');

describe('API de autenticação', () => {
  it('deve fazer login com sucesso', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'admin' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('deve falhar login com senha errada', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'errada' });
    expect(res.statusCode).toBe(401);
  });

  it('deve renovar o token', async () => {
    const login = await request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'admin' });
    const res = await request(app)
      .post('/refresh')
      .send({ refreshToken: login.body.refreshToken });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('deve negar acesso ao /users sem token', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(401);
  });

  it('deve retornar usuários com token válido', async () => {
    const login = await request(app)
      .post('/login')
      .send({ email: 'admin@admin.com', password: 'admin' });
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].email).toBe('admin@admin.com');
    expect(res.body[0].passwordHash).toBeUndefined();
  });
});
