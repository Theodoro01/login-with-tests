import bcrypt from 'bcryptjs'
import User from '../models/User.js';

export default {
    execute: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ error: 'Email e password são obrigatórios' });
        }
      
        try {
          const usuario = await User.findOne({ email });
      
          if (!usuario) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
          }
      
          const isPassword = await bcrypt.compare(password, usuario.password);
      
          if (!isPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
          }

          usuario.password = undefined;
      
          return res.status(200).json({
            message: 'Login bem-sucedido!',
            usuario: {
              name: usuario.name,
              email: usuario.email,
            },
          });
        } catch (err) {
          res.status(500).json({ error: 'Erro ao fazer login' });
        }
      }
}
  