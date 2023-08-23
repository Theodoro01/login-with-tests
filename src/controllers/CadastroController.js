import bcrypt from 'bcryptjs'
import User from '../models/User.js';

export default {
    execute: async (req, res) => {
        const { name, email, password } = req.body;
      
        if (!name || !email || !password) {
          return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
      
        try { 
          const hashedPassword = await bcrypt.hash(password, 10);
      
          const newUser = new User({ name, email, password: hashedPassword });
          const savedUser = await newUser.save();
      
          res.status(200).json({
            message: 'Usuário cadastrado com sucesso!',
            usuario: savedUser,
          });
        } catch (err) {
          res.status(500).json({ error: 'Erro ao cadastrar usuário' });
        }
      }
}