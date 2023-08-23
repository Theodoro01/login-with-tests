import bcrypt from 'bcryptjs';
import LoginController from '../../src/controllers/LoginController.js';
import User from '../../src/models/User';

describe('Testes de Unidade - Login de Usuário', () => {
    const mockReq = (body) => ({ body });
    const mockRes = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
  
    it('Deve realizar o login com sucesso', async () => {
      const req = mockReq({
        email: 'joao@email.com',
        password: '123456',
      });

      const res = mockRes()
  
      const mockUser = {
        _id: 'mockedId',
        name: 'Usuário de Teste',
        email: 'joao@email.com',
        password: '123456',
      };
  
      User.findOne = jest.fn().mockResolvedValue(mockUser);
  
      bcrypt.compare = jest.fn().mockResolvedValue(true);
  
      const result = await LoginController.execute(req, res);
  
      expect(result.status).toHaveBeenCalledWith(200);
      expect(result.json).toHaveBeenCalledWith({
        message: 'Login bem-sucedido!',
        usuario: {
          name: 'Usuário de Teste',
          email: 'joao@email.com',
        },
      });
    });

  it('Deve lançar erro ao tentar fazer login sem email ou senha', async () => {
    const testData = [
      { email: 'testuser@example.com' },
      { password: 'hashedSenha' },
      {},
    ];

    for (const data of testData) {
      const req = mockReq(data);
      const res = mockRes();

      await LoginController.execute(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email e password são obrigatórios' });
    }
  });

  it('Deve lançar erro ao não encontrar o usuário durante o login', async () => {
    const req = mockReq({
      email: 'testuser@example.com',
      password: 'hashedSenha',
    });
    const res = mockRes();

    User.findOne = jest.fn().mockResolvedValue(null);

    await LoginController.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
  });

  it('Deve lançar erro ao ocorrer erro durante a verificação da senha', async () => {
    const req = mockReq({
      email: 'testuser@example.com',
      password: 'hashedSenha',
    });
    const res = mockRes();

    const mockUser = {
      _id: 'mockedId',
      name: 'Usuário de Teste',
      email: 'testuser@example.com',
      password: 'hashedPassword',
    };

    User.findOne = jest.fn().mockResolvedValue({
      select: jest.fn().mockReturnValue(mockUser),
    });

    bcrypt.compare = jest.fn().mockRejectedValue(new Error('Erro ao comparar senhas'));

    await LoginController.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao fazer login' });
  });

  it('Deve lançar erro ao ocorrer erro durante o login', async () => {
    const req = mockReq({
      email: 'testuser@example.com',
      password: 'hashedSenha',
    });
    const res = mockRes();

    const mockUser = {
      _id: 'mockedId',
      name: 'Usuário de Teste',
      email: 'testuser@example.com',
      password: 'hashedPassword',
    };

    User.findOne = jest.fn().mockResolvedValue({
      select: jest.fn().mockReturnValue(mockUser),
    });

    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await LoginController.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas' });
  });
});
