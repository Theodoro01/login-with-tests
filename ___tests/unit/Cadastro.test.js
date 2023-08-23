import bcrypt from 'bcryptjs';
import CadastroController from '../../src/controllers/CadastroController.js';
import User from '../../src/models/User.js';
import { v4 as uuidv4 } from 'uuid';


describe('Testes de Unidade - Cadastro de Usuário', () => {
  let generationEmail;

  beforeEach(() => {
    generationEmail = `testuser-${uuidv4()}@example.com`;
  });
  const mockReq = (body) => ({ body });
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('Deve cadastrar um novo usuário corretamente', async () => {
    const req = mockReq({
      name: 'Usuário de Teste',
      email: 'testuser@example.com',
      password: 'hashedSenha',
    });
    const res = mockRes();

    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
    User.prototype.save = jest.fn().mockResolvedValue({
      _id: 'mockedId',
      name: 'Usuário de Teste',
      email: generationEmail,
      password: 'hashedPassword',
    });

    await CadastroController.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário cadastrado com sucesso!',
      usuario: {
        _id: 'mockedId',
        name: 'Usuário de Teste',
        email: generationEmail,
        password: 'hashedPassword',
      },
    });
  });

  it('Deve lançar erro ao tentar cadastrar usuário sem nome, email ou senha', async () => {
    const testData = [
      { email: generationEmail, password: 'hashedSenha' },
      { name: 'Usuário de Teste', password: 'hashedSenha' },
      { name: 'Usuário de Teste', email: generationEmail },
      {},
    ];

    for (const data of testData) {
      const req = mockReq(data);
      const res = mockRes();

      await CadastroController.execute(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Todos os campos são obrigatórios' });
    }
  });

  it('Deve lançar erro ao ocorrer um erro durante o cadastro', async () => {
    const req = mockReq({
      name: 'Usuário de Teste',
      email: generationEmail,
      password: 'hashedSenha',
    });
    const res = mockRes();

    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
    User.prototype.save = jest.fn().mockRejectedValue(new Error('Erro ao salvar usuário'));

    await CadastroController.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao cadastrar usuário' });
  });
});
