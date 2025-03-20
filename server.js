const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware para extrair tenantId do subdomínio
app.use((req, res, next) => {
  const tenantId = req.hostname.split('.')[0] || 'pizzaria-a'; // Default para teste
  req.tenantId = tenantId;
  next();
});

app.use(cors());
app.use(express.json());

// Configuração do Mongoose para evitar aviso de strictQuery
mongoose.set('strictQuery', false);

// Conexão com MongoDB
console.log('Tentando conectar ao MongoDB com URI:', process.env.MONGODB_URI ?);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
