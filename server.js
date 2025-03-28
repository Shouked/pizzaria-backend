const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

console.log('✅ server.js carregado em: ' + new Date().toISOString());

// Configuração do CORS
app.use(cors({
  origin: 'https://pizzadabia.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middlewares
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/tenants', (req, res, next) => {
  console.log('Rota /api/tenants atingida:', req.method, req.path, 'em: ' + new Date().toISOString());
  next();
}, require('./routes/tenants'));
app.use('/api/products', require('./routes/products'));

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
