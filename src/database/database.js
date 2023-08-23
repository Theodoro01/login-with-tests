import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

export default {
  connectToDatabase: () => {
    mongoose.connect(process.env.MONGO_URL)
      .then(() => {
        console.log('Conexão bem-sucedida com o banco de dados');
      })
      .catch((err) => {
        console.error('Erro ao conectar ao banco de dados:', err);
      });
    
  }
}