import request from 'supertest'
import app from '../../app.js'

describe('Testes de Integração', () => {

  describe('POST /login', () => {
    it('Deve fazer o login com sucesso', async () => {
      const response = await request(app)
        .post('/v1/login')
        .send({
          email: 'novousuario@example.com',
          password: 'senha123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login bem-sucedido!');
      expect(response.body.usuario.name).toBe('Novo Usuário');
    });

    it('Deve retornar erro de credenciais inválidas', async () => {
      const response = await request(app)
        .post('/v1/login')
        .send({
          email: 'novousuario@example.com',
          password: 'senhaErrada',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Credenciais inválidas');
    });
  });

  it('Deve retornar erro ao fazer login com senha incorreta', async () => {
    const response = await request(app)
      .post('/v1/login')
      .send({
        email: 'novousuario@example.com',
        password: 'senhaerrada',
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Credenciais inválidas');
  });

  it('Deve retornar erro ao fazer login com email não registrado', async () => {
    const response = await request(app)
      .post('/v1/login')
      .send({
        email: 'naoexiste@example.com', // Email não registrado
        password: 'senha123',
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Credenciais inválidas');
  });
});
