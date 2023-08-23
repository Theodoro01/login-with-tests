import request from 'supertest'
import app from '../../app.js'
import { v4 as uuidv4 } from 'uuid';

describe('Testes de Integração', () => {
  let generationEmail;

  beforeEach(() => {
    generationEmail = `testuser-${uuidv4()}@example.com`;
  });

  describe('POST /cadastro', () => {
    it('Deve cadastrar um novo usuário', async () => {
      const response = await request(app)
        .post('/v1/cadastro')
        .send({
          name: 'Novo Usuário',
          email: generationEmail,
          password: 'senha123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuário cadastrado com sucesso!');
    });
  });

  it('Deve retornar erro ao cadastrar um usuário sem nome', async () => {
    const response = await request(app)
      .post('/v1/cadastro')
      .send({
        email: generationEmail,
        password: 'senha123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Todos os campos são obrigatórios');
  });

  it('Deve retornar erro ao cadastrar um usuário sem email', async () => {
    const response = await request(app)
      .post('/v1/cadastro')
      .send({
        name: 'Usuário de Teste',
        password: 'senha123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Todos os campos são obrigatórios');
  });

  it('Deve retornar erro ao cadastrar um usuário sem senha', async () => {
    const response = await request(app)
      .post('/v1/cadastro')
      .send({
        name: 'Usuário de Teste',
        email: 'teste@example.com',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Todos os campos são obrigatórios');
  });
});
