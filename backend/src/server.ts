import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth';

// Configurar dotenv
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rotas
app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`
🚀 Servidor backend rodando em http://localhost:${port}
⏰ ${new Date().toLocaleString()}
  `);
});
