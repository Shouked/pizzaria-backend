const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'https://pizzadabia.netlify.app', // Permite apenas o frontend no Netlify
  credentials: true, // Permite envio de cookies ou headers como Authorization
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
}));

// Middlewares
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/tenants', require('./routes/tenants')); // Certifique-se de que isso está incluído

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
